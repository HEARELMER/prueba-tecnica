import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
@Injectable({ providedIn: 'root' })
export class UbigeoService {
  private cache: UbigeoNormalized | null = null;
  private loading: Promise<UbigeoNormalized> | null = null;

  constructor(private readonly http: HttpClient) {}

  async load(): Promise<UbigeoNormalized> {
    if (this.cache) {
      return this.cache;
    }
    if (this.loading) {
      return this.loading;
    }

    this.loading = this.http
      .get<UbigeoJson>('/assets/data.json')
      .toPromise()
      .then((raw) => this.normalize(raw as UbigeoJson))
      .then((normalized) => {
        this.cache = normalized;
        this.loading = null;
        return normalized;
      })
      .catch((err) => {
        this.loading = null;
        throw err;
      });

    return this.loading;
  }

  getDepartments(): string[] {
    return this.cache?.departments ?? [];
  }

  getProvinces(department: string): string[] {
    if (!department || !this.cache) return [];
    return this.cache.mapDeptToProvinces.get(department) ?? [];
  }

  getDistricts(department: string, province: string): string[] {
    if (!department || !province || !this.cache) return [];
    const key = `${department}|${province}`;
    return this.cache.mapDeptProvToDistricts.get(key) ?? [];
  }

  private normalize(raw: UbigeoJson): UbigeoNormalized {
    const mapDeptToProvinces = new Map<string, string[]>();
    const mapDeptProvToDistricts = new Map<string, string[]>();

    const departments = Object.values(raw)
      .map((d) => d.nombre)
      .sort((a, b) => a.localeCompare(b, 'es'));

    for (const dep of Object.values(raw)) {
      const provinceList = Object.values(dep.provincias)
        .map((p) => p.nombre)
        .sort((a, b) => a.localeCompare(b, 'es'));
      mapDeptToProvinces.set(dep.nombre, provinceList);

      for (const prov of Object.values(dep.provincias)) {
        const districts = Object.values(prov.distritos).sort((a, b) =>
          a.localeCompare(b, 'es')
        );
        const key = `${dep.nombre}|${prov.nombre}`;
        mapDeptProvToDistricts.set(key, districts);
      }
    }

    return { departments, mapDeptToProvinces, mapDeptProvToDistricts };
  }
}

interface UbigeoNormalized {
  departments: string[];
  mapDeptToProvinces: Map<string, string[]>;
  mapDeptProvToDistricts: Map<string, string[]>;
}

export type UbigeoJson = Record<
  string,
  {
    nombre: string;
    provincias: Record<
      string,
      {
        nombre: string;
        distritos: Record<string, string>;
      }
    >;
  }
>;
