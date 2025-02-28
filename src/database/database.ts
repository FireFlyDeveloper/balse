import { getXataClient } from "./xata";

class Database {
    private client: any;

    constructor() {
        this.client = getXataClient();
    }

    async getRootAdmin(key: string): Promise<any> {
        try {
            const record = await this.client.db.root.read(`${key}`);
            return record;
        } catch (error) {
            console.error(error);
        }
    }

    async getRootInstructors() {
        try {
            const records = await this.client.db.instructors
                .select(["first_name", "middle_name", "last_name", "subjects"])
                .getAll();
            return records;
        } catch (error) {
            console.error(error);
        }
    }
}

export default new Database();