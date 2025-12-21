import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';

import { ClientsSdkService } from '@/sdk/clients/clients-sdk.service';
import { SecuritySdkService } from '@/sdk/security/security-sdk.service';
import { DocumentType, RegisterClientRequest } from '@/sdk/models';
import { ZardFormModule } from '@/shared/components/form/form.module';
import { ZardSelectComponent } from '@/shared/components/select/select.component';
import { ZardSelectItemComponent } from '@/shared/components/select/select-item.component';
import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardIconComponent } from '@/shared/components/icon/icon.component';

interface BonusOption {
  id: 'casino' | 'sports' | 'none';
  title: string;
  subtitle: string;
  accent: string;
}

type Gender = 'M' | 'F' | 'O';

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ZardFormModule,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ZardBadgeComponent,
    ZardIconComponent,
  ],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly securitySdk = inject(SecuritySdkService);
  private readonly clientsSdk = inject(ClientsSdkService);

  readonly bonusOptions: BonusOption[] = [
    {
      id: 'casino',
      title: '100 giros gratis',
      subtitle: 'Para casino',
      accent: 'from-emerald-400 to-cyan-500',
    },
    {
      id: 'sports',
      title: 'Apuesta gratis',
      subtitle: 'Para deportes',
      accent: 'from-orange-400 to-amber-400',
    },
    {
      id: 'none',
      title: 'Sin bono',
      subtitle: 'Registro sin promo',
      accent: 'from-slate-400 to-slate-500',
    },
  ];

  readonly documentTypes: { value: DocumentType; label: string }[] = [
    { value: 'DNI', label: 'DNI' },
    { value: 'CE', label: 'Carnet de extranjería' },
  ];

  readonly months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  readonly days = Array.from({ length: 31 }, (_, index) => index + 1);
  readonly years = this.buildYears();
  readonly departments = ['Lima', 'Cusco', 'Arequipa', 'Piura', 'Junín'];
  readonly provinces = ['Lima', 'Urubamba', 'Camaná', 'Paita', 'Huancayo'];
  readonly districts = [
    'Miraflores',
    'San Isidro',
    'La Molina',
    'Barranco',
    'Comas',
  ];
  readonly genders: { value: Gender; label: string }[] = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
    { value: 'O', label: 'Otro' },
  ];
  readonly inputClasses =
    'w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-base text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 transition';

  loadingToken = false;
  submitting = false;
  statusMessage = '';
  statusTone: 'success' | 'error' | '' = '';

  readonly form = this.fb.group(
    {
      bonus: new FormControl<BonusOption['id']>('casino', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      documentType: new FormControl<DocumentType>('DNI', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      documentNumber: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),
        ],
      }),
      names: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      surnames: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      department: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      province: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      district: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      phoneCode: new FormControl('+51', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      phoneNumber: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^\d{6,12}$/)],
      }),
      gender: new FormControl<Gender | null>(null, {
        validators: [Validators.required],
      }),
      birthYear: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
      birthMonth: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
      birthDay: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
      tokenCode: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^\d{8}$/)],
      }),
    },
    { validators: [this.adultValidator()] }
  );

  ngOnInit(): void {
    this.fetchToken();
  }

  getControl(controlName: keyof typeof this.form.controls): FormControl {
    return this.form.get(controlName) as FormControl;
  }

  async fetchToken(): Promise<void> {
    this.loadingToken = true;
    this.statusTone = '';
    try {
      const token = await firstValueFrom(this.securitySdk.generateToken$());
      this.form.patchValue({ tokenCode: token.tokenCode });
    } catch (error) {
      const message =
        (error as Error)?.message ?? 'No se pudo obtener el token de seguridad';
      this.statusTone = 'error';
      this.statusMessage = message;
    } finally {
      this.loadingToken = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const birthDateIso = this.buildBirthDateIso();
    if (!birthDateIso) {
      this.form.setErrors({ invalidDate: true });
      this.statusTone = 'error';
      this.statusMessage = 'Fecha de nacimiento inválida';
      return;
    }

    const formValue = this.form.getRawValue();

    const payload: RegisterClientRequest = {
      nombres: formValue.names.trim(),
      apellidos: formValue.surnames.trim(),
      tipo_documento: formValue.documentType,
      nro_documento: formValue.documentNumber.trim(),
      fecha_nacimiento: birthDateIso,
      bono_bienvenida: formValue.bonus !== 'none',
      token_code: formValue.tokenCode.trim(),
      departamento: formValue.department.trim(),
      provincia: formValue.province.trim(),
      distrito: formValue.district.trim(),
      codigo_celular: formValue.phoneCode.trim(),
      numero_celular: formValue.phoneNumber.trim(),
      genero: formValue.gender ?? 'O',
    };

    this.submitting = true;
    this.statusTone = '';

    try {
      const response = await firstValueFrom(
        this.clientsSdk.registerClient$(payload)
      );
      this.statusTone = 'success';
      this.statusMessage = `Cliente ${response.nombres} registrado`; // backend returns nombres & apellidos
      toast.success('Cliente registrado correctamente');
      this.form.reset({
        bonus: formValue.bonus,
        documentType: 'DNI',
        documentNumber: '',
        names: '',
        surnames: '',
        department: '',
        province: '',
        district: '',
        phoneCode: '+51',
        phoneNumber: '',
        gender: null,
        birthYear: null,
        birthMonth: null,
        birthDay: null,
        tokenCode: payload.token_code,
      });
    } catch (error) {
      const message =
        (error as Error)?.message ?? 'No se pudo completar el registro';
      this.statusTone = 'error';
      this.statusMessage = message;
      toast.error(message);
    } finally {
      this.submitting = false;
    }
  }

  private adultValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const year = control.get('birthYear')?.value;
      const month = control.get('birthMonth')?.value;
      const day = control.get('birthDay')?.value;

      if (!year || !month || !day) {
        return null;
      }

      const date = new Date(Number(year), Number(month) - 1, Number(day));
      const isValidDate =
        !isNaN(date.getTime()) &&
        date.getFullYear() === Number(year) &&
        date.getMonth() === Number(month) - 1 &&
        date.getDate() === Number(day);

      if (!isValidDate) {
        return { invalidDate: true };
      }

      const age = this.calculateAge(date);
      if (age < 18) {
        return { underAge: true };
      }

      return null;
    };
  }

  private buildBirthDateIso(): string | null {
    const { birthYear, birthMonth, birthDay } = this.form.getRawValue();
    if (!birthYear || !birthMonth || !birthDay) {
      return null;
    }
    const date = new Date(
      Number(birthYear),
      Number(birthMonth) - 1,
      Number(birthDay)
    );
    if (Number.isNaN(date.getTime())) {
      return null;
    }

    const yyyy = date.getFullYear();
    const mm = `${date.getMonth() + 1}`.padStart(2, '0');
    const dd = `${date.getDate()}`.padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  private buildYears(): number[] {
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear - 18; // must be at least 18
    const earliestYear = currentYear - 90; // allow older users
    const years: number[] = [];
    for (let year = maxYear; year >= earliestYear; year--) {
      years.push(year);
    }
    return years;
  }
}
