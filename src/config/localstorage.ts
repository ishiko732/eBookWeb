interface storageValue {
    value: string,
    expire: number
}
class LocalStorage {
    /**
     * 设置 localStorage
     * @param key
     * @param value
     */
    public setItem(key: string, value: string, expire: number) {
        localStorage.removeItem(key);
        localStorage.setItem(key, JSON.stringify({
            "value": value,
            "expire": Date.now() + expire
        }));
        return this;
    }

    /**
     * 判断一个 localStorage 是否过期
     * @param key
     * @returns {boolean}
     */
    public isExpire(key: string): boolean {
        const values: string | null = localStorage.getItem(key)
        if (values) {
            const value: storageValue = JSON.parse(values);
            // 当前时间是否大于过期时间
            return Date.now() > value.expire;
        } else {
            return true;
        }
    }
    /**
     * 获取某个 localStorage 值
     * @param key
     * @returns {*}
     */
    public getItem(key: string): string | null {
        const values: string | null = localStorage.getItem(key)
        if (values) {
            const value: storageValue = JSON.parse(values);
            // 当前时间是否大于过期时间
            if (Date.now() < value.expire) {
                return value.value
            }
            return null;
        } else {
            return null;
        }

    }
    public removeItem(key: string): void {
        localStorage.removeItem(key);
    }
};
const localstorage = new LocalStorage();
export default localstorage;