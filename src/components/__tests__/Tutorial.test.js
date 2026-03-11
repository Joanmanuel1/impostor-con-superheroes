import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Tutorial from '../Tutorial.vue';

const stubs = {
  IonIcon: { template: '<span />' },
};

describe('Tutorial.vue', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders first slide initially', () => {
    const wrapper = mount(Tutorial, { global: { stubs } });
    expect(wrapper.text()).toContain('Objetivo');
  });

  it('advances to next slide on SIGUIENTE click', async () => {
    const wrapper = mount(Tutorial, { global: { stubs } });
    await wrapper.find('.btn-primary').trigger('click');
    expect(wrapper.text()).toContain('Roles');
  });

  it('advances through all slides', async () => {
    const wrapper = mount(Tutorial, { global: { stubs } });
    // Slide 0 → 1
    await wrapper.find('.btn-primary').trigger('click');
    expect(wrapper.text()).toContain('Roles');
    // Slide 1 → 2
    await wrapper.find('.btn-primary').trigger('click');
    expect(wrapper.text()).toContain('Dinámica');
    // Slide 2 → 3 (last)
    await wrapper.find('.btn-primary').trigger('click');
    expect(wrapper.text()).toContain('Votación');
  });

  it('shows ¡ENTENDIDO! on last slide', async () => {
    const wrapper = mount(Tutorial, { global: { stubs } });
    // Go to last slide
    for (let i = 0; i < 3; i++) {
      await wrapper.find('.btn-primary').trigger('click');
    }
    expect(wrapper.find('.btn-success').text()).toContain('¡ENTENDIDO!');
  });

  it('emits close and saves to localStorage on finishTutorial', async () => {
    const wrapper = mount(Tutorial, { global: { stubs } });
    // Go to last slide
    for (let i = 0; i < 3; i++) {
      await wrapper.find('.btn-primary').trigger('click');
    }
    await wrapper.find('.btn-success').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('close');
    expect(localStorage.getItem('tutorial_seen')).toBe('true');
  });

  it('emits close on OMITIR click', async () => {
    const wrapper = mount(Tutorial, { global: { stubs } });
    await wrapper.find('.btn-link').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('close');
    expect(localStorage.getItem('tutorial_seen')).toBe('true');
  });

  it('renders indicator dots for each slide', () => {
    const wrapper = mount(Tutorial, { global: { stubs } });
    const dots = wrapper.findAll('.indicator-dot');
    expect(dots).toHaveLength(4);
    expect(dots[0].classes()).toContain('active');
  });

  it('updates active indicator on slide change', async () => {
    const wrapper = mount(Tutorial, { global: { stubs } });
    await wrapper.find('.btn-primary').trigger('click');
    const dots = wrapper.findAll('.indicator-dot');
    expect(dots[1].classes()).toContain('active');
    expect(dots[0].classes()).not.toContain('active');
  });
});
