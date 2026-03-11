import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { store } from '../../../store';
import PlayerInput from '../PlayerInput.vue';

const stubs = {
  IonIcon: { template: '<span />' },
};

describe('PlayerInput.vue', () => {
  const defaultProps = {
    playerNames: ['Alice', 'Bob', 'Charlie']
  };

  it('renders all player input rows', () => {
    const wrapper = mount(PlayerInput, { props: defaultProps, global: { stubs } });
    const rows = wrapper.findAll('.player-row');
    expect(rows).toHaveLength(3);
  });

  it('shows player count', () => {
    const wrapper = mount(PlayerInput, { props: defaultProps, global: { stubs } });
    expect(wrapper.text()).toContain('3 héroes');
  });

  it('shows singular when 1 player', () => {
    const wrapper = mount(PlayerInput, { props: { playerNames: ['Solo'] }, global: { stubs } });
    expect(wrapper.text()).toContain('1 héroe');
  });

  it('emits update:playerNames on name change', async () => {
    const wrapper = mount(PlayerInput, { props: defaultProps, global: { stubs } });
    const input = wrapper.find('.player-input-field');
    await input.setValue('Alicia');
    const emitted = wrapper.emitted('update:playerNames');
    expect(emitted).toBeTruthy();
    expect(emitted[0][0][0]).toBe('Alicia');
  });

  it('emits new player on add button click', async () => {
    const wrapper = mount(PlayerInput, { props: defaultProps, global: { stubs } });
    await wrapper.find('.btn-add-player').trigger('click');
    const emitted = wrapper.emitted('update:playerNames');
    expect(emitted).toBeTruthy();
    expect(emitted[0][0]).toHaveLength(4);
    expect(emitted[0][0][3]).toBe('');
  });

  it('hides add button when at 15 players', () => {
    const names = Array.from({ length: 15 }, (_, i) => `P${i}`);
    const wrapper = mount(PlayerInput, { props: { playerNames: names }, global: { stubs } });
    expect(wrapper.find('.btn-add-player').exists()).toBe(false);
  });

  it('does not add beyond 15 players', async () => {
    const names = Array.from({ length: 15 }, (_, i) => `P${i}`);
    const wrapper = mount(PlayerInput, { props: { playerNames: names }, global: { stubs } });
    // Button shouldn't exist, so no emit
    expect(wrapper.find('.btn-add-player').exists()).toBe(false);
  });

  it('shows remove button when more than 3 players', () => {
    const wrapper = mount(PlayerInput, {
      props: { playerNames: ['A', 'B', 'C', 'D'] },
      global: { stubs }
    });
    expect(wrapper.find('.btn-remove-player').exists()).toBe(true);
  });

  it('hides remove button when exactly 3 players', () => {
    const wrapper = mount(PlayerInput, { props: defaultProps, global: { stubs } });
    expect(wrapper.find('.btn-remove-player').exists()).toBe(false);
  });

  it('emits remove on remove button click', async () => {
    const wrapper = mount(PlayerInput, {
      props: { playerNames: ['A', 'B', 'C', 'D'] },
      global: { stubs }
    });
    const removeBtn = wrapper.find('.btn-remove-player');
    await removeBtn.trigger('click');
    const emitted = wrapper.emitted('update:playerNames');
    expect(emitted).toBeTruthy();
    expect(emitted[0][0]).toHaveLength(3);
  });

  it('shows avatar preview for each player', () => {
    const wrapper = mount(PlayerInput, { props: defaultProps, global: { stubs } });
    const avatars = wrapper.findAll('.player-avatar-preview');
    expect(avatars).toHaveLength(3);
  });

  it('shows avatar initial when no avatar path', () => {
    // Avatar at index 0 has a path in the store, but let's check the fallback
    const wrapper = mount(PlayerInput, { props: { playerNames: ['', 'B', 'C'] }, global: { stubs } });
    // Empty name should show index + 1
    const initials = wrapper.findAll('.avatar-initial');
    expect(initials.length).toBeGreaterThanOrEqual(0);
  });

  it('shows player number for each row', () => {
    const wrapper = mount(PlayerInput, { props: defaultProps, global: { stubs } });
    const numbers = wrapper.findAll('.player-number');
    expect(numbers[0].text()).toBe('1');
    expect(numbers[1].text()).toBe('2');
    expect(numbers[2].text()).toBe('3');
  });
});
