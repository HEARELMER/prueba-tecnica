import { Repository } from "typeorm";
import { GlobalParameterRepositoryPort } from "../../../domain/ports/out/global-parameter-repository.port";
import { GlobalParameterEntity } from "./global-parameter.entity";

export class TypeOrmGlobalParameterRepository
  implements GlobalParameterRepositoryPort
{
  constructor(private readonly repo: Repository<GlobalParameterEntity>) {}

  async findValue(paramKey: string): Promise<string | null> {
    const record = await this.repo.findOne({ where: { paramKey } });
    return record?.paramValue ?? null;
  }

  async findAll(): Promise<{ key: string; value: string }[]> {
    const records = await this.repo.find();
    return records.map((r) => ({ key: r.paramKey, value: r.paramValue }));
  }

  async upsert(paramKey: string, paramValue: string): Promise<void> {
    const existing = await this.repo.findOne({ where: { paramKey } });
    if (existing) {
      existing.paramValue = paramValue;
      await this.repo.save(existing);
      return;
    }

    const entity = this.repo.create({ paramKey, paramValue });
    await this.repo.save(entity);
  }
}
