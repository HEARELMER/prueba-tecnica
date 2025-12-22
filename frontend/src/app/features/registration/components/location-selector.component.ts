import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZardSelectComponent } from '@/shared/components/select/select.component';
import { ZardSelectItemComponent } from '@/shared/components/select/select-item.component';

@Component({
  selector: 'app-location-selector',
  standalone: true,
  imports: [CommonModule, ZardSelectComponent, ZardSelectItemComponent],
  template: `
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-white">Lugar de residencia</h3>
        <span class="text-xs text-slate-400"
          >Departamento / Provincia / Distrito</span
        >
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <z-select
          [(zValue)]="departmentValue"
          zPlaceholder="Departamento"
          (zSelectionChange)="onDepartmentChange.emit($event)"
        >
          @for (dep of departments; track dep) {
          <z-select-item
            (click)="onSelectDepartment.emit(dep)"
            [zValue]="dep"
            >{{ dep }}</z-select-item
          >
          }
        </z-select>
        <z-select
          [(zValue)]="provinceValue"
          zPlaceholder="Provincia"
          (zSelectionChange)="onProvinceChange.emit($event)"
        >
          @for (prov of provinces; track prov) {
          <z-select-item
            (click)="onSelectProvince.emit(prov)"
            [zValue]="prov"
            >{{ prov }}</z-select-item
          >
          }
        </z-select>
        <z-select
          [(zValue)]="districtValue"
          zPlaceholder="Distrito"
          (zSelectionChange)="onDistrictChange.emit($event)"
        >
          @for (dist of districts; track dist) {
          <z-select-item
            (click)="onSelectDistrict.emit(dist)"
            [zValue]="dist"
            >{{ dist }}</z-select-item
          >
          }
        </z-select>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationSelectorComponent {
  @Input() departments: string[] = [];
  @Input() provinces: string[] = [];
  @Input() districts: string[] = [];
  @Input() departmentValue: string = '';
  @Input() provinceValue: string = '';
  @Input() districtValue: string = '';

  @Output() onSelectDepartment = new EventEmitter<string>();
  @Output() onSelectProvince = new EventEmitter<string>();
  @Output() onSelectDistrict = new EventEmitter<string>();
  @Output() onDepartmentChange = new EventEmitter<string | string[]>();
  @Output() onProvinceChange = new EventEmitter<string | string[]>();
  @Output() onDistrictChange = new EventEmitter<string | string[]>();
}
