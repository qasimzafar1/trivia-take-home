import { AppService } from "../utils/app-service.ts";

export class MatchService extends AppService {
  async getMatch(id: number) {
    const db = await this.getDb();

    return db.match.findUnique({ where: { id } });
  }

  async createMatch() {
    const db = await this.getDb();

    return db.match.create({});
  }

  async updateMatch(id: number, winnerId: number | null) {
    const db = await this.getDb();

    return db.match.update({ where: { id }, data: { winnerId } });
  }
}
