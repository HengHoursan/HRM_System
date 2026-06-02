import { defineStore } from "pinia";
import { AuthService } from "@/services/auth/auth.service";
import { userService } from "@/services/user/user.service";
import type { LoginRequest, RegisterRequest, User } from "@/types";
const authService = new AuthService();

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: (() => {
      try {
        const item = localStorage.getItem("user");
        return item && item !== "undefined" ? JSON.parse(item) : null;
      } catch {
        return null;
      }
    })() as User | null,
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },
  actions: {
    async login(payload: LoginRequest) {
      const response = await authService.login(payload);
      if (response.success && response.data) {
        this.setAuth(response.data);
        await this.fetchUser(); // fetchUser gets full profile including permissions[]
      }
      return response;
    },
    async register(payload: RegisterRequest) {
      const response = await authService.register(payload);
      if (response.success && response.data) {
        this.setAuth(response.data);
        await this.fetchUser();
      }
      return response;
    },
    setAuth(data: { accessToken: string; refreshToken: string; user?: User }) {
      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      
      // Dispatch a storage event manually for same-tab listeners if needed (optional)
      // fetchUser() will handle setting the user object
    },
    async logout() {
      try {
        await authService.logout(this.refreshToken || undefined);
      } finally {
        this.clearAuth();
      }
    },
    clearAuth() {
      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    },
    async fetchUser() {
      if (!this.accessToken) return;
      try {
        // Backend /users/me now returns permissions[] directly in UserResponse
        const response = await userService.getMe();
        if (response.success && response.data) {
          this.user = response.data;
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    },
    setUser(user: Partial<User>) {
      if (this.user) {
        // Merge updated data with existing user data (permissions, role, etc)
        this.user = { ...this.user, ...user };
      } else {
        this.user = user as User;
      }
      localStorage.setItem("user", JSON.stringify(this.user));
    },
    initSync() {
      window.addEventListener("storage", (event) => {
        if (event.key === "accessToken") {
          if (!event.newValue) {
            // Logged out in another tab
            this.clearAuth();
            window.location.href = "/login";
          } else if (event.newValue !== this.accessToken) {
            // Logged in as another user in another tab
            window.location.reload();
          }
        }
      });
    },
  },
});
