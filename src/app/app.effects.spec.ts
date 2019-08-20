import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs';

import { AppEffects } from './app.effects';
import { Action } from '@ngrx/store';

describe('AppEffects', () => {
  let effects: AppEffects;
  let actions: ReplaySubject<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppEffects,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get<AppEffects>(AppEffects);
    actions = new ReplaySubject<Action>(1);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
