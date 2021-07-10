from api.validation_methods import user_unauthorised_response
from database.user_dao import does_user_belong_to_a_project, get_user_public_key
from database.project_dao import create_new_project, get_project_by_name, get_all_projects_of_a_user,get_owner_of_the_project, get_project_by_id
from middleware.auth import check_token
from flask import Blueprint, request, make_response, g
import re
import os
from base64 import b64encode
from cryptography.hazmat.primitives.serialization import load_pem_public_key
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.primitives import hashes

project_api = Blueprint('project_api', __name__)


@project_api.route("/projects/all", methods=['GET'])
@check_token
def get_projects():
    requestor_email = g.requestor_email
    projects_of_the_user = get_all_projects_of_a_user(requestor_email)
    projects = []

    for p in projects_of_the_user:
        projects.append({
            '_id': str(p.id),
            'name': p.project_name,
            'owner': get_owner_of_the_project(p).username
        })

    # sort projects by owner
    projects = sorted(projects, key=lambda k: k['owner']) 
    response = {'projects': projects}
    return make_response(response), 200


@project_api.route("/projects/<project_id>", methods=['GET'])
@check_token
def get_project_description(project_id):
    requestor_email = g.requestor_email

    if not does_user_belong_to_a_project(requestor_email, project_id):
        return user_unauthorised_response()

    project = get_project_by_id(project_id)
    owner = get_owner_of_the_project(project)

    project = {
        '_id': str(project.id),
        'owner': owner.username,
        'name': project.project_name,
        'state': project.state,
        'encryption_state': project.encryption_state
    }

    # sort projects by owner
    response = {'project': project}
    return make_response(response), 200


# @project_api.route('/projects/<project_name>/agreement_score', methods=['GET'])
# def get_agreement_score(project_name):
#     id_token = request.args.get('id_token')
#     requestor_email = get_email(id_token)

#     invalid_token = check_id_token(id_token, requestor_email)
#     if invalid_token is not None:
#         return make_response(invalid_token), 400

#     user_col = get_col(project_name, "users")
#     requestor = user_col.find_one({'email': requestor_email})
#     if requestor is None:
#         return user_unauthorised_response()

#     doc_col = get_col(project_name, "documents")

#     all_docs = doc_col.find({})
#     agreed = 0
#     not_agreed = 0
#     for doc in all_docs:
#         if len(doc['user_and_labels']) == 2:
#             label_1 = doc['user_and_labels'][0]['label']
#             label_2 = doc['user_and_labels'][1]['label']
#             if label_1 == label_2:
#                 agreed = agreed + 1
#             else:
#                 not_agreed = not_agreed + 1

#     analysed = agreed + not_agreed

#     return_dict = {
#         "agreed_number": agreed,
#         "not_agreed_number": not_agreed,
#         "analysed_number": analysed,
#         "total_number": doc_col.count_documents({})
#     }

#     return return_dict, 200

'''
Create a new project for the current user
request format:
body： {
    project_name: project_name,
    encryption_state: True/False
}
'''


@project_api.route("/projects/create", methods=['POST'])
@check_token
def create_project():
    global en_entry_key
    print("create project called")
    requestor_email = g.requestor_email

    if 'project_name' in request.json:
        project_name = request.json['project_name']
    else:
        response = {'message': "Missing project name"}
        return make_response(response), 400

    if not re.match(r'^\w+$', project_name):
        response = {'message': "Project name can only be Alphanumerics and underscores"}
        return make_response(response), 400

    db_project = get_project_by_name(project_name)
    if db_project is None:
        # TODO check if the project should be encrypted, if yes, generate encrypted entry key 
        encryption_state = request.json['encryption_state']
        print('encrypt_status: ', encryption_state)

        if encryption_state:
            pkstring = get_user_public_key(requestor_email)
            print(pkstring)
            public_key = load_pem_public_key(bytes(pkstring, 'utf-8'))
            isinstance(public_key, rsa.RSAPublicKey)
            entry_key = os.urandom(32)

            en_entry_key = public_key.encrypt(
                entry_key,
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None)
            )
            create_new_project(requestor_email, request.json, b64encode(en_entry_key).decode())
        else:
            create_new_project(requestor_email, request.json)
    else:
        response = {'message': "Project already exists"}
        return make_response(response), 400

    return "", 204

# @project_api.route("/projects/<project_name>/delete", methods=['DELETE'])
# def delete_project(project_name):
#     id_token = request.args.get('id_token')
#     requestor_email = get_email(id_token)

#     invalid_token = check_id_token(id_token, requestor_email)
#     if invalid_token is not None:
#         return make_response(invalid_token), 400

#     if project_name == "local" or project_name == "users" or project_name == "admin":
#         response = {'message': "Cannot delete that project because it is not a user created project"}
#         return make_response(response), 400

#     user_col = get_col(project_name, "users")
#     requestor = user_col.find_one({'email': requestor_email, 'isAdmin': True})
#     if requestor is None:
#         return user_unauthorised_response()

#     my_client = get_db_client()
#     names = my_client.list_database_names()
#     if project_name in names:
#         all_users = user_col.find({})
#         for user in all_users:
#             user_email = user['email']
#             remove_project_from_user(user_email, project_name)
#         my_client.drop_database(project_name)
#     else:
#         response = {'message': "Project does not exist"}
#         return make_response(response), 400

#     return "", 204
