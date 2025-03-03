import { FormControl } from '@angular/forms';

export interface CreateUserForm {
  username: FormControl<string | null>;
  name: FormControl<string | null>;
  password: FormControl<string | null>;
  passwordConfirmation: FormControl<string | null>;
  isAdmin: FormControl<boolean | null>;
  canCreate: FormControl<boolean | null>;
  canDelete: FormControl<boolean | null>;
  canRead: FormControl<boolean | null>;
  canUpdate: FormControl<boolean | null>;
}

export type Permissions = {
  key: PermissionKeys;
  label: string;
  value: boolean | null;
  options: {
    label: string;
    value: boolean | null;
  }[];
};

export enum PermissionKeys {
  isAdmin = 'isAdmin',
  canCreate = 'canCreate',
  canUpdate = 'canUpdate',
  canDelete = 'canDelete',
}

export const DISPLAYED_PERMISSIONS_FIELDS: Permissions[] = [
  {
    key: PermissionKeys.canCreate,
    label: 'Może dodawać',
    value: null,
    options: [
      { label: 'Tak', value: true },
      { label: 'Nie', value: false },
    ],
  },
  {
    key: PermissionKeys.canUpdate,
    label: 'Może modyfikować',
    value: null,
    options: [
      { label: 'Tak', value: true },
      { label: 'Nie', value: false },
    ],
  },
  {
    key: PermissionKeys.canDelete,
    label: 'Może usuwać',
    value: null,
    options: [
      { label: 'Tak', value: true },
      { label: 'Nie', value: false },
    ],
  },
  {
    key: PermissionKeys.isAdmin,
    label: 'Administrator',
    value: null,
    options: [
      { label: 'Tak', value: true },
      { label: 'Nie', value: false },
    ],
  },
];
