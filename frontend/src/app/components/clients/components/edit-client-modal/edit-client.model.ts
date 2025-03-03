import { FormControl } from '@angular/forms';

export interface EditClientForm {
  name: FormControl<string | null>;
  address: FormControl<string | null>;
  invoiceIsDone: FormControl<boolean | null>;
  showOnMap: FormControl<boolean | null>;
  invoiceAcceptanceDate: FormControl<Date | null | undefined>;
  description: FormControl<string | null>;
  teamId: FormControl<string | null | undefined>;
}
