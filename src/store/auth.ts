import {defineStore} from 'pinia';
import {User} from "@/intrefaces/User";
import instance from "../axios";


interface AuthState {
    user: User | null;
    users: User[] | [];
    token: string | null,
}

export const useAuthStore = defineStore('auth', {

    state: (): AuthState => ({
        user: (() => {
            const user: string | null = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        })(),
        token: localStorage.getItem('token') || null,
        users: []
    }),
    actions: {
        async register(userData: {
            name: string;
            surname: string;
            email: string;
            fiscal_code: string;
            phone_number: string;
            date_of_birth: string;
            password: string;
            c_password: string
        }) {
            // eslint-disable-next-line no-useless-catch
            try {
                const response = await instance.post('/register', userData);
                return response.data.message;
            } catch (error) {
                throw error;
            }
        },
        async login(userData: { email: string; password: string }) {
            // eslint-disable-next-line no-useless-catch
            try {
                const response = await instance.post('/login', userData, {
                    withCredentials: true
                });
                this.user = response.data.data.user;
                localStorage.setItem('user', JSON.stringify(this.user))
                this.token = response.data.data.token;
                if (this.user) {
                    localStorage.setItem('token', this.token ?? '');
                    instance.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
                    await this.fetchUsers();
                }
            } catch (error) {
                throw error
            }
        },
        async fetchUsers() {
            instance.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
            // eslint-disable-next-line no-useless-catch
            try {
                const response = await instance.get('/users');
                this.users = response.data.data.users;
            } catch (error) {
                // throw error;
            }
        },
        async logout() {
            await instance.post('/logout');
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        async updateUser(user: Partial<User>) {
            try {
                const response = await instance.put(`/users/${user.id}`, user);
                this.users = this.users.map(u => (u.id === user.id ? response.data.user : u));
            } catch (error) {
                console.error('Failed to update user:', error);
            }
        },

        async deleteUser(userId: number) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
            try {
                await instance.delete(`/users/${userId}`);
                // this.users = this.users.filter(u => u.id !== userId);
            } catch (error) {
                console.error('Failed to delete user:', error);
            }
        },
    },
    getters: {
        isAuthenticated: (state) => !!state.user,
    },
});