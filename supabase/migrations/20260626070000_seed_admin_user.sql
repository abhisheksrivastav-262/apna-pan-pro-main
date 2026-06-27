DO $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Check if the user already exists
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'misbahur@admin.com';

    IF new_user_id IS NULL THEN
        new_user_id := gen_random_uuid();
        -- Insert the new user into auth.users
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            new_user_id,
            'authenticated',
            'authenticated',
            'misbahur@admin.com',
            crypt('admin123', gen_salt('bf')),
            now(),
            now(),
            now(),
            '{"provider":"email","providers":["email"]}',
            '{}',
            false
        );
    ELSE
        -- If they exist, force update their password and confirm their email
        UPDATE auth.users
        SET encrypted_password = crypt('admin123', gen_salt('bf')),
            email_confirmed_at = now()
        WHERE id = new_user_id;
    END IF;

    -- Ensure they have the admin role in the user_roles table
    IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = new_user_id AND role = 'admin') THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (new_user_id, 'admin');
    END IF;
END $$;
