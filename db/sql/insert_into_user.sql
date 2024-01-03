INSERT INTO public.user
(id, created_by, created_on, updated_by, updated_on, first_name, last_name, email, password, active, scopes)
VALUES (
    'af0ab5d4-ce2f-488b-b8cf-83f4a683be95',
    'af0ab5d4-ce2f-488b-b8cf-83f4a683be95',
    '2023-12-17 00:59:12',
    'af0ab5d4-ce2f-488b-b8cf-83f4a683be95',
    '2023-12-17 00:59:12',
    'Admin',
    'Admin',
    'admin@localhost',
    MD5('Admin123'),
    true,
    'administrator.all read.all write.all'
)