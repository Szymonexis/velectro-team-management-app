import { FormControl } from '@angular/forms';

export interface CreateTeamForm {
  name: FormControl<string | null>;
  address: FormControl<string | null>;
  range: FormControl<number | null>;
  description: FormControl<string | null>;
}
