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
}
