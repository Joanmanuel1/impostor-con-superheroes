import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import GameConfig from '../GameConfig.vue';

const stubs = {
  IonIcon: { template: '<span />' },
};

describe('GameConfig.vue', () => {
  const defaultProps = {
    showCategory: true,
    impostorHint: true,
    villainCount: 1,
    maxVillains: 4
  };

  it('renders category option card', () => {
    const wrapper = mount(GameConfig, { props: defaultProps, global: { stubs } });
    expect(wrapper.text()).toContain('Categoría');
    expect(wrapper.text()).toContain('Visible');
  });

  it('shows category as Oculta when showCategory is false', () => {
    const wrapper = mount(GameConfig, { props: { ...defaultProps, showCategory: false }, global: { stubs } });
    expect(wrapper.text()).toContain('Oculta');
  });

  it('emits update:showCategory on category card click', async () => {
    const wrapper = mount(GameConfig, { props: defaultProps, global: { stubs } });
    const cards = wrapper.findAll('.option-card-premium');
    await cards[0].trigger('click');
    expect(wrapper.emitted('update:showCategory')).toBeTruthy();
    expect(wrapper.emitted('update:showCategory')[0]).toEqual([false]);
  });

  it('shows hint as Activada/Desactivada', () => {
    const wrapper = mount(GameConfig, { props: defaultProps, global: { stubs } });
    expect(wrapper.text()).toContain('Activada');

    const wrapper2 = mount(GameConfig, { props: { ...defaultProps, impostorHint: false }, global: { stubs } });
    expect(wrapper2.text()).toContain('Desactivada');
  });

  it('emits update:impostorHint on hint card click', async () => {
    const wrapper = mount(GameConfig, { props: defaultProps, global: { stubs } });
    const cards = wrapper.findAll('.option-card-premium');
    await cards[1].trigger('click');
    expect(wrapper.emitted('update:impostorHint')).toBeTruthy();
    expect(wrapper.emitted('update:impostorHint')[0]).toEqual([false]);
  });

  it('shows villain count badge', () => {
    const wrapper = mount(GameConfig, { props: defaultProps, global: { stubs } });
    expect(wrapper.find('.villain-count-badge').text()).toBe('1');
  });

  it('increments villain count on + click', async () => {
    const wrapper = mount(GameConfig, { props: defaultProps, global: { stubs } });
    const buttons = wrapper.findAll('.btn-villain-step');
    await buttons[1].trigger('click'); // + button
    expect(wrapper.emitted('update:villainCount')).toBeTruthy();
    expect(wrapper.emitted('update:villainCount')[0]).toEqual([2]);
  });

  it('decrements villain count on - click', async () => {
    const wrapper = mount(GameConfig, { props: { ...defaultProps, villainCount: 2 }, global: { stubs } });
    const buttons = wrapper.findAll('.btn-villain-step');
    await buttons[0].trigger('click'); // - button
    expect(wrapper.emitted('update:villainCount')).toBeTruthy();
    expect(wrapper.emitted('update:villainCount')[0]).toEqual([1]);
  });

  it('does not decrement below 1', async () => {
    const wrapper = mount(GameConfig, { props: { ...defaultProps, villainCount: 1 }, global: { stubs } });
    const buttons = wrapper.findAll('.btn-villain-step');
    await buttons[0].trigger('click');
    expect(wrapper.emitted('update:villainCount')).toBeUndefined();
  });

  it('does not increment above maxVillains', async () => {
    const wrapper = mount(GameConfig, { props: { ...defaultProps, villainCount: 4, maxVillains: 4 }, global: { stubs } });
    const buttons = wrapper.findAll('.btn-villain-step');
    await buttons[1].trigger('click');
    expect(wrapper.emitted('update:villainCount')).toBeUndefined();
  });

  it('applies active class when option is enabled', () => {
    const wrapper = mount(GameConfig, { props: defaultProps, global: { stubs } });
    const cards = wrapper.findAll('.option-card-premium');
    expect(cards[0].classes()).toContain('active');
    expect(cards[1].classes()).toContain('active');
  });
});
