import os

def check_if_file_is_pdf(file_name):
    split_tup = os.path.splitext(file_name)
    file_name = split_tup[0]
    file_extension = split_tup[1]

    if file_extension.lower() == ".pdf":
        return True
    return False