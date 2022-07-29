import { getDatabase, ref, set, child, get } from 'firebase/database';
import { app } from './authentication';

class DataBase {
    async readUserData(userId) {
        const dbRef = ref(getDatabase(app));
        let dataUser;
        try {
            dataUser = await get(child(dbRef, `users/${userId}`));
            if (dataUser.exists()) {
                return dataUser.val();
            }
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    writeUserData(userId, watched, queue, statePage) {
        const db = getDatabase(app);
        set(ref(db, 'users/' + userId), {
            watched: watched,
            queue: queue,
            state: statePage,
        });
    }
}

export default function getDataBase() {
    return new DataBase();
}
