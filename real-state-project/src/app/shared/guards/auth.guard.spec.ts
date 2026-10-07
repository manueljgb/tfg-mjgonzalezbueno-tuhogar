import { AuthGuard } from './auth.guard';
import { of } from 'rxjs';

describe('AuthGuard', () => {
  it('permite el acceso con sesion', () => {
    const router: any = { navigate: jasmine.createSpy('navigate') };
    const guard = new AuthGuard({ isLoggedIn: () => of(true) } as any, router);
    guard.canActivate().subscribe(result => expect(result).toBeTrue());
    expect(router.navigate).not.toHaveBeenCalled();
  });
  it('redirige al login sin sesion', () => {
    const router: any = { navigate: jasmine.createSpy('navigate') };
    const guard = new AuthGuard({ isLoggedIn: () => of(false) } as any, router);
    guard.canActivate().subscribe(result => expect(result).toBeFalse());
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
