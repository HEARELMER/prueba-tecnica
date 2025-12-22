import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZardIconComponent } from '@/shared/components/icon/icon.component';
import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';

@Component({
  selector: 'app-success-screen',
  standalone: true,
  imports: [CommonModule, ZardIconComponent, ZardBadgeComponent],
  template: `
    <div
      class="relative min-h-screen overflow-hidden bg-slate-950 text-white flex items-center justify-center"
    >
      <div class="pointer-events-none absolute inset-0 opacity-60">
        <div
          class="absolute -left-20 top-10 h-64 w-64 rounded-full bg-emerald-500/25 blur-3xl"
        ></div>
        <div
          class="absolute right-0 top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]"
        ></div>
        <div
          class="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-amber-500/10 blur-[120px]"
        ></div>
      </div>

      <div class="relative mx-auto max-w-2xl px-4 py-10 lg:py-14 text-center">
        <div class="space-y-6">
          <div class="flex justify-center">
            <div
              class="rounded-full bg-emerald-500/20 p-6 shadow-lg shadow-emerald-500/20"
            >
              <z-icon
                zType="check"
                zSize="xl"
                class="text-emerald-400"
              />
            </div>
          </div>

          <div class="space-y-2">
            <h1 class="text-4xl font-bold text-white">¡Registro exitoso!</h1>
            <p class="text-lg text-slate-300">
              {{ message }}
            </p>
          </div>

          <div
            class="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-6 space-y-4 text-left"
          >
            <div>
              <p class="text-sm text-slate-400 uppercase tracking-wider">
                Nombre completo
              </p>
              <p class="text-lg font-semibold text-white">{{ fullName }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-400 uppercase tracking-wider">
                Documento
              </p>
              <p class="text-lg font-semibold text-white">{{ documentInfo }}</p>
            </div>
          </div>

          <button
            (click)="onContinue.emit()"
            class="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:brightness-110"
          >
            <span>Continuar</span>
            <z-icon zType="arrow-right" class="text-slate-900" />
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessScreenComponent {
  @Input() message: string = 'Tu cuenta ha sido creada correctamente.';
  @Input() fullName: string = '';
  @Input() documentInfo: string = '';
  @Output() onContinue = new EventEmitter<void>();
}
