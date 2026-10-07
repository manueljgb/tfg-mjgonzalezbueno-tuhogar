import { HouseCardComponent } from './house-card.component';

describe('HouseCardComponent', () => {
  afterEach(() => sessionStorage.removeItem('favs'));
  it('no confunde el favorito 1 con el 10', () => {
    sessionStorage.setItem('favs', '[10]');
    const component = new HouseCardComponent();
    component.appartmentData = { id: 1 } as any;
    component.ngOnInit();
    expect(component.fav).toBeFalse();
    component.toggleFavStatus();
    expect(JSON.parse(sessionStorage.getItem('favs')!)).toContain(1);
    component.toggleFavStatus();
    expect(JSON.parse(sessionStorage.getItem('favs')!)).toEqual([10]);
  });
});
