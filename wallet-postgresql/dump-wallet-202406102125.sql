PGDMP     ,            
        |            wallet    15.6 (Homebrew)    15.6 (Homebrew) #    Y           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            Z           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            [           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            \           1262    16928    wallet    DATABASE     h   CREATE DATABASE wallet WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
    DROP DATABASE wallet;
                sumetph    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                pg_database_owner    false            ]           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   pg_database_owner    false    4            �            1255    25326 -   fn_test(character varying, character varying)    FUNCTION     �  CREATE FUNCTION public.fn_test(account_id character varying, category_type_id character varying) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
declare amount numeric;
begin
	  	select 
			sum(transaction_amount) into amount
		from transactions t
		where 
			t.account_id = fn_test.account_id
			and
			t.category_type_id = fn_test.category_type_id 
		group by t.account_id;
	
		return amount;
END;
$$;
 `   DROP FUNCTION public.fn_test(account_id character varying, category_type_id character varying);
       public          sumetph    false    4            �            1259    25129    wallet_account    TABLE     �  CREATE TABLE public.wallet_account (
    account_id character varying NOT NULL,
    account_name character varying NOT NULL,
    account_type_id character varying NOT NULL,
    account_created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    account_updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id character varying(250) NOT NULL,
    account_balance numeric(10,2) DEFAULT 0 NOT NULL
);
 "   DROP TABLE public.wallet_account;
       public         heap    sumetph    false    4            �            1259    25120    wallet_account_type    TABLE     F  CREATE TABLE public.wallet_account_type (
    account_type_id character varying NOT NULL,
    account_type_name character varying NOT NULL,
    account_type_created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    account_type_updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
 '   DROP TABLE public.wallet_account_type;
       public         heap    sumetph    false    4            �            1259    25306    wallet_budget    TABLE     ~  CREATE TABLE public.wallet_budget (
    budget_id character varying NOT NULL,
    budget_name character varying NOT NULL,
    budget_amount numeric(10,2) NOT NULL,
    budget_created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    budget_updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    category_id character varying NOT NULL
);
 !   DROP TABLE public.wallet_budget;
       public         heap    sumetph    false    4            �            1259    25152    wallet_category    TABLE     c  CREATE TABLE public.wallet_category (
    category_id character varying NOT NULL,
    category_name character varying NOT NULL,
    category_type_id character varying NOT NULL,
    category_created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    category_updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
 #   DROP TABLE public.wallet_category;
       public         heap    sumetph    false    4            �            1259    25143    wallet_category_type    TABLE     K  CREATE TABLE public.wallet_category_type (
    category_type_id character varying NOT NULL,
    category_type_name character varying NOT NULL,
    category_type_created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    category_type_updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
 (   DROP TABLE public.wallet_category_type;
       public         heap    sumetph    false    4            �            1259    25166    wallet_transaction    TABLE     �  CREATE TABLE public.wallet_transaction (
    transaction_id character varying NOT NULL,
    transaction_amount numeric(10,2) NOT NULL,
    account_id character varying NOT NULL,
    category_id character varying NOT NULL,
    transaction_note character varying,
    transaction_created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    transaction_updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
 &   DROP TABLE public.wallet_transaction;
       public         heap    sumetph    false    4            �            1259    33519    wallet_user    TABLE     I  CREATE TABLE public.wallet_user (
    user_id character varying(250) NOT NULL,
    user_name character varying(250) NOT NULL,
    user_created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_password character varying(250) NOT NULL
);
    DROP TABLE public.wallet_user;
       public         heap    sumetph    false    4            Q          0    25129    wallet_account 
   TABLE DATA           �   COPY public.wallet_account (account_id, account_name, account_type_id, account_created_at, account_updated_at, user_id, account_balance) FROM stdin;
    public          sumetph    false    215   i4       P          0    25120    wallet_account_type 
   TABLE DATA           �   COPY public.wallet_account_type (account_type_id, account_type_name, account_type_created_at, account_type_updated_at) FROM stdin;
    public          sumetph    false    214   �7       U          0    25306    wallet_budget 
   TABLE DATA           �   COPY public.wallet_budget (budget_id, budget_name, budget_amount, budget_created_at, budget_updated_at, category_id) FROM stdin;
    public          sumetph    false    219   e8       S          0    25152    wallet_category 
   TABLE DATA           �   COPY public.wallet_category (category_id, category_name, category_type_id, category_created_at, category_updated_at) FROM stdin;
    public          sumetph    false    217   9       R          0    25143    wallet_category_type 
   TABLE DATA           �   COPY public.wallet_category_type (category_type_id, category_type_name, category_type_created_at, category_type_updated_at) FROM stdin;
    public          sumetph    false    216   \:       T          0    25166    wallet_transaction 
   TABLE DATA           �   COPY public.wallet_transaction (transaction_id, transaction_amount, account_id, category_id, transaction_note, transaction_created_at, transaction_updated_at) FROM stdin;
    public          sumetph    false    218   �:       V          0    33519    wallet_user 
   TABLE DATA           j   COPY public.wallet_user (user_id, user_name, user_created_at, user_updated_at, user_password) FROM stdin;
    public          sumetph    false    220   �<       �           2606    33540 $   wallet_user UQ_wallet_user_user_name 
   CONSTRAINT     f   ALTER TABLE ONLY public.wallet_user
    ADD CONSTRAINT "UQ_wallet_user_user_name" UNIQUE (user_name);
 P   ALTER TABLE ONLY public.wallet_user DROP CONSTRAINT "UQ_wallet_user_user_name";
       public            sumetph    false    220            �           2606    25137     wallet_account wallet_account_pk 
   CONSTRAINT     f   ALTER TABLE ONLY public.wallet_account
    ADD CONSTRAINT wallet_account_pk PRIMARY KEY (account_id);
 J   ALTER TABLE ONLY public.wallet_account DROP CONSTRAINT wallet_account_pk;
       public            sumetph    false    215            �           2606    25128 *   wallet_account_type wallet_account_type_pk 
   CONSTRAINT     u   ALTER TABLE ONLY public.wallet_account_type
    ADD CONSTRAINT wallet_account_type_pk PRIMARY KEY (account_type_id);
 T   ALTER TABLE ONLY public.wallet_account_type DROP CONSTRAINT wallet_account_type_pk;
       public            sumetph    false    214            �           2606    25314    wallet_budget wallet_budget_pk 
   CONSTRAINT     c   ALTER TABLE ONLY public.wallet_budget
    ADD CONSTRAINT wallet_budget_pk PRIMARY KEY (budget_id);
 H   ALTER TABLE ONLY public.wallet_budget DROP CONSTRAINT wallet_budget_pk;
       public            sumetph    false    219            �           2606    25160 "   wallet_category wallet_category_pk 
   CONSTRAINT     i   ALTER TABLE ONLY public.wallet_category
    ADD CONSTRAINT wallet_category_pk PRIMARY KEY (category_id);
 L   ALTER TABLE ONLY public.wallet_category DROP CONSTRAINT wallet_category_pk;
       public            sumetph    false    217            �           2606    25151 ,   wallet_category_type wallet_category_type_pk 
   CONSTRAINT     x   ALTER TABLE ONLY public.wallet_category_type
    ADD CONSTRAINT wallet_category_type_pk PRIMARY KEY (category_type_id);
 V   ALTER TABLE ONLY public.wallet_category_type DROP CONSTRAINT wallet_category_type_pk;
       public            sumetph    false    216            �           2606    25174 (   wallet_transaction wallet_transaction_pk 
   CONSTRAINT     r   ALTER TABLE ONLY public.wallet_transaction
    ADD CONSTRAINT wallet_transaction_pk PRIMARY KEY (transaction_id);
 R   ALTER TABLE ONLY public.wallet_transaction DROP CONSTRAINT wallet_transaction_pk;
       public            sumetph    false    218            �           2606    33527    wallet_user wallet_user_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.wallet_user
    ADD CONSTRAINT wallet_user_pkey PRIMARY KEY (user_id);
 F   ALTER TABLE ONLY public.wallet_user DROP CONSTRAINT wallet_user_pkey;
       public            sumetph    false    220            �           2606    33546 0   wallet_account FK_wallet_account_account_type_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.wallet_account
    ADD CONSTRAINT "FK_wallet_account_account_type_id" FOREIGN KEY (account_type_id) REFERENCES public.wallet_account_type(account_type_id) ON UPDATE SET NULL ON DELETE SET NULL;
 \   ALTER TABLE ONLY public.wallet_account DROP CONSTRAINT "FK_wallet_account_account_type_id";
       public          sumetph    false    214    3501    215            �           2606    33541 (   wallet_account FK_wallet_account_user_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.wallet_account
    ADD CONSTRAINT "FK_wallet_account_user_id" FOREIGN KEY (user_id) REFERENCES public.wallet_user(user_id);
 T   ALTER TABLE ONLY public.wallet_account DROP CONSTRAINT "FK_wallet_account_user_id";
       public          sumetph    false    215    220    3515            �           2606    25315 .   wallet_budget wallet_budget_wallet_category_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.wallet_budget
    ADD CONSTRAINT wallet_budget_wallet_category_fk FOREIGN KEY (category_id) REFERENCES public.wallet_category(category_id);
 X   ALTER TABLE ONLY public.wallet_budget DROP CONSTRAINT wallet_budget_wallet_category_fk;
       public          sumetph    false    219    3507    217            �           2606    25218 7   wallet_category wallet_category_wallet_category_type_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.wallet_category
    ADD CONSTRAINT wallet_category_wallet_category_type_fk FOREIGN KEY (category_type_id) REFERENCES public.wallet_category_type(category_type_id);
 a   ALTER TABLE ONLY public.wallet_category DROP CONSTRAINT wallet_category_wallet_category_type_fk;
       public          sumetph    false    216    3505    217            �           2606    25175 7   wallet_transaction wallet_transaction_wallet_account_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.wallet_transaction
    ADD CONSTRAINT wallet_transaction_wallet_account_fk FOREIGN KEY (account_id) REFERENCES public.wallet_account(account_id);
 a   ALTER TABLE ONLY public.wallet_transaction DROP CONSTRAINT wallet_transaction_wallet_account_fk;
       public          sumetph    false    3503    215    218            �           2606    25180 8   wallet_transaction wallet_transaction_wallet_category_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.wallet_transaction
    ADD CONSTRAINT wallet_transaction_wallet_category_fk FOREIGN KEY (category_id) REFERENCES public.wallet_category(category_id);
 b   ALTER TABLE ONLY public.wallet_transaction DROP CONSTRAINT wallet_transaction_wallet_category_fk;
       public          sumetph    false    218    3507    217            Q   ?  x���=�#E���)�ّ���&kx�8��88�1&�aM.@`io����;�fwh��U��*�˗�2�)�nd�ur��ͧ�������_�BHh��)�&�i^3;���3�l�B�=�Ls(���'���EW�S͛{v��x����Z|jJ������������o����?.�?�P0ঁ���$��%y"ܐ�TV�r�-]�O+ϑh��xBQ�`eRU��T�%݄�$���B���.�~�劂x��Ӳ+�^con��ci�kIZ�%H�=S���Δ���c��Ʃ��^`F�A�^��56���i_�����_H�6�Id��^��}����sOؠ
�P�,;6S�6�O򼔄C�(o�V��o-g�B#�N`\DKXe�	�mֺ�(�wO?ԟ��sg]�l�p���c�Ǩ�f�xeؤ0oI��BM{�#�ޗ��a�J	���R���t�)����P'��=Q|S�9�.����+-�b�勴��n�W&G9H���EF	tD�Hk%��
P�iz�C�H[╣�|з7�����j�֦@k��h}Fٱs�J����iA���)(�V�R��9��J�b��JQ�vȽy�3O\�k
����{
�&[��=@�z*}@�}C�2g��Z&����ЍC��!�Ҽ�6a
C��+�`�h�&�C��~}
=�����Y�������X��x��cNG+wgF�V�\�1zhD�5\�+����w )�1��A�n��ϚT����	>FL�9f�:g7����s���/H<_s�>:�ob�Q�"oC�=�p���et��bf���A)R�������c5�      P   �   x�}�1
�@E��)�@��f��=�����]jk��b��6�(&S�I3���7.�#�ě�w�ͼ���Ͻ���j�\(�����q%�ĉ8=q6�hl�f�u�r!�0���9Lqr�_qU��hZ$�׳���fZ���麤�TVE�Xǰɶ���u_      U   �   x�}ͱ�0@�ڞ��e;�3���Eh�1��h��m4
��\�߼�Gg�c�k����"DGH���p�<�
�8�#*Z5-*�s�Cm�#�K��,*"���W�[��o��������:��Ʊ�q�I+n�i�\��6k0����"�՟����-GE      S   ?  x�}�MJ1F�ݧ�5䧪S5gq�T��ť
�u��F���&G1�n�azB���*��~�Z|�$���u�5�8����w���y���C0���vk���ѡ�
9�W1�/�����ff��uh��V����];���U�wAVШ2���ɩ+=��x�2k�%ߡ���iu��[;�\�+���!�a
�zD����_�PR��Z}l���;�_[=.%�we:��`Tƈg`5]�J�����(�������h�>���['[č!C.���	�KS�ԿGot2�r���$�s.x!���6F�4�
o7�8��c�~      R   R   x�3�|�c���X�`Gǃ�6��������������������������9).#dӀ��v�¡�����W� YQ2}      T   -  x���Kn�0E��*������������=(�I� ����.?�8v���m����"(݇��,1��(��R�� -&x� �;l��K94Z�����y-?��a�Bޣ�~�$�Do���7���^��hGĀ6Zd�>`�!�h�>G�y���<f4��uα@Xj=p�m7��`�|���S��.S`xM3���a;Nٺh��,���F��&0�
�mA�+Y����Fh=|
G�L���ҿ	K���v������~>��n-��jE�\U5���'��8;�t2�8ܾ�K�*;C����w`٤#�a��N��tK��{��"�3�%����3�a�Νu���;M�$��������W1�@oWC;Wiw�͒	{/�@>D;�ݿwz�4lay��#۹ƪ��d��c�9�ܔ0�|?��{8ˣ/�G$�cj�o��[�w�HY�)��OfϳI���	�r�c|�^��~���uˬ��k�Z���Z3��o^D�#7�^^��#�d��T�\A6Af�����Q��K��[����
�ޥ�Rr��������:���H�      V   0  x����S�@@��Wt��k��e?`�CiX�f��:]XQ�p�����Ů�]�ǂ�
�"&��\";�l�E�)��%�j}�� ��0G_�p09p*�2U����O��%�yp9c�jG�����c������h��l�c�c�Γk��������5��� A�o�P�,]�wU���9��!�We1��:�f�54p%������"P�"�U	'Z�߭?��C�@yI��5��Lw��7V*\�}���W��:�'����=��,�7E3x\(�����!}�-��Y�O;�+=�af|��5w<     