
import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';
import {
  persistState,
  sessionStorageStrategy,
} from '@ngneat/elf-persist-state';
import { ApplicationUser } from '../models/user.model';
import { select } from '@ngneat/elf';
import { map } from 'rxjs';

export interface AuthProps {
  user: ApplicationUser | null;
  token: string | null;
}

const authStore = createStore({ name: 'auth' }, withProps<AuthProps>({ user: null, token: null }));

export const persist = persistState(authStore, {
  key: 'mini-task-hub-auth',
  storage: sessionStorageStrategy,
});

@Injectable({ providedIn: 'root' })
export class AuthRepository {
  user$ = authStore.pipe(select((state) => state.user));
  token$ = authStore.pipe(select((state) => state.token));
  isAuthenticated$ = this.user$.pipe(map((user) => !!user));

  update({ user, token }: AuthProps) {
    authStore.update((state) => ({
      ...state,
      user,
      token,
    }));
  }

  logout() {
    authStore.update((state) => ({
      ...state,
      user: null,
      token: null,
    }));
  }

  getTokenSnapshot(): string | null {
    return authStore.getValue().token;
  }
}
