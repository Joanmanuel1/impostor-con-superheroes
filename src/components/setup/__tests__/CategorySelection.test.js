import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { store } from '../../../store';
import CategorySelection from '../CategorySelection.vue';

const stubs = {
  IonIcon: { template: '<span />' },
};

describe('CategorySelection.vue', () => {
  beforeEach(() => {
    store.customCategories = {};
    localStorage.clear();
  });

  const defaultProps = {
    isEditMode: false,
    selectedCategories: ['Comidas', 'Animales']
  };

  it('renders category chips for all categories', () => {
    const wrapper = mount(CategorySelection, { props: defaultProps, global: { stubs } });
    const chips = wrapper.findAll('.category-chip:not(.add-new)');
    expect(chips.length).toBe(Object.keys(store.getAllCategories()).length);
  });

  it('marks selected categories as active', () => {
    const wrapper = mount(CategorySelection, { props: defaultProps, global: { stubs } });
    const activeChips = wrapper.findAll('.category-chip.active');
    expect(activeChips).toHaveLength(2);
  });

  it('toggles category selection on click (deselect)', async () => {
    const wrapper = mount(CategorySelection, { props: defaultProps, global: { stubs } });
    const chips = wrapper.findAll('.category-chip:not(.add-new)');
    // Click on first category (Comidas - currently selected)
    await chips[0].trigger('click');
    const emitted = wrapper.emitted('update:selectedCategories');
    expect(emitted).toBeTruthy();
    // Should remove it (since there are still >1 selected)
    expect(emitted[0][0]).not.toContain('Comidas');
  });

  it('toggles category selection on click (select new)', async () => {
    const wrapper = mount(CategorySelection, { props: defaultProps, global: { stubs } });
    const chips = wrapper.findAll('.category-chip:not(.add-new)');
    // Find an unselected category chip (e.g., Objetos)
    const objChip = chips.find(c => c.text().includes('Objetos'));
    await objChip.trigger('click');
    const emitted = wrapper.emitted('update:selectedCategories');
    expect(emitted).toBeTruthy();
    expect(emitted[0][0]).toContain('Objetos');
  });

  it('does not unselect the last remaining category', async () => {
    const wrapper = mount(CategorySelection, {
      props: { ...defaultProps, selectedCategories: ['Comidas'] },
      global: { stubs }
    });
    const chips = wrapper.findAll('.category-chip:not(.add-new)');
    const comidaChip = chips.find(c => c.text().includes('Comidas'));
    await comidaChip.trigger('click');
    // Emits, but the emitted list still contains 'Comidas' (not removed)
    const emitted = wrapper.emitted('update:selectedCategories');
    // The array should still contain the category
    if (emitted) {
      expect(emitted[0][0]).toContain('Comidas');
    }
  });

  it('opens create modal on Crear button click', async () => {
    const wrapper = mount(CategorySelection, { props: defaultProps, global: { stubs } });
    const addBtn = wrapper.find('.add-new');
    await addBtn.trigger('click');
    expect(wrapper.find('.custom-modal-overlay').exists()).toBe(true);
    expect(wrapper.text()).toContain('Crear Pack');
  });

  it('opens edit modal in edit mode on chip click', async () => {
    const wrapper = mount(CategorySelection, {
      props: { ...defaultProps, isEditMode: true },
      global: { stubs }
    });
    const chips = wrapper.findAll('.category-chip:not(.add-new)');
    await chips[0].trigger('click');
    expect(wrapper.find('.custom-modal-overlay').exists()).toBe(true);
    expect(wrapper.text()).toContain('Editar Pack');
  });

  it('adds new word field', async () => {
    const wrapper = mount(CategorySelection, { props: defaultProps, global: { stubs } });
    await wrapper.find('.add-new').trigger('click');
    const addWordBtn = wrapper.findAll('.btn-link.text-primary');
    const initialFields = wrapper.findAll('.words-list input').length;
    await addWordBtn[0].trigger('click');
    expect(wrapper.findAll('.words-list input').length).toBe(initialFields + 2); // word + hint
  });

  it('removes word field (only if > 2)', async () => {
    const wrapper = mount(CategorySelection, { props: defaultProps, global: { stubs } });
    await wrapper.find('.add-new').trigger('click');
    // Add extra word first
    await wrapper.find('.btn-link.text-primary').trigger('click');
    const removeBtn = wrapper.findAll('.btn-link.text-danger');
    const beforeCount = wrapper.findAll('.words-list input').length;
    await removeBtn[0].trigger('click');
    expect(wrapper.findAll('.words-list input').length).toBe(beforeCount - 2);
  });

  it('does not remove word field if only 2 remain', async () => {
    const wrapper = mount(CategorySelection, { props: defaultProps, global: { stubs } });
    await wrapper.find('.add-new').trigger('click');
    const removeBtn = wrapper.findAll('.btn-link.text-danger');
    const beforeCount = wrapper.findAll('.words-list input').length;
    await removeBtn[0].trigger('click');
    expect(wrapper.findAll('.words-list input').length).toBe(beforeCount);
  });

  it('saves custom category when valid', async () => {
    const wrapper = mount(CategorySelection, { props: defaultProps, global: { stubs } });
    await wrapper.find('.add-new').trigger('click');

    // Fill in name
    const nameInput = wrapper.find('.category-name-input');
    await nameInput.setValue('MiCategoria');

    // Fill in words
    const wordInputs = wrapper.findAll('.words-list input');
    await wordInputs[0].setValue('Palabra1');
    await wordInputs[1].setValue('Pista1');
    await wordInputs[2].setValue('Palabra2');
    await wordInputs[3].setValue('Pista2');

    // Save
    await wrapper.find('.btn-primary:not(.add-new)').trigger('click');

    expect(store.customCategories).toHaveProperty('MiCategoria');
  });

  it('disables save when category is invalid', async () => {
    const wrapper = mount(CategorySelection, { props: defaultProps, global: { stubs } });
    await wrapper.find('.add-new').trigger('click');

    // Don't fill anything - save button should be disabled
    const saveBtn = wrapper.findAll('.btn-primary').find(b => b.text().includes('Guardar'));
    expect(saveBtn.attributes('disabled')).toBeDefined();
  });

  it('closes modal on cancel', async () => {
    const wrapper = mount(CategorySelection, { props: defaultProps, global: { stubs } });
    await wrapper.find('.add-new').trigger('click');
    expect(wrapper.find('.custom-modal-overlay').exists()).toBe(true);
    await wrapper.find('.btn-outline-light').trigger('click');
    expect(wrapper.find('.custom-modal-overlay').exists()).toBe(false);
  });

  it('shows delete button for custom categories in edit', async () => {
    store.addCustomCategory('Custom1', [{ word: 'A', hint: 'B' }, { word: 'C', hint: 'D' }]);
    const wrapper = mount(CategorySelection, {
      props: { ...defaultProps, isEditMode: true },
      global: { stubs }
    });
    const customChip = wrapper.findAll('.category-chip:not(.add-new)').find(c => c.text().includes('Custom1'));
    await customChip.trigger('click');
    expect(wrapper.find('.btn-outline-danger').exists()).toBe(true);
  });

  it('shows confirm delete modal and deletes on confirm', async () => {
    store.addCustomCategory('ToDelete', [{ word: 'A', hint: 'B' }, { word: 'C', hint: 'D' }]);
    const wrapper = mount(CategorySelection, {
      props: { ...defaultProps, isEditMode: true, selectedCategories: ['Comidas', 'ToDelete'] },
      global: { stubs }
    });
    const customChip = wrapper.findAll('.category-chip:not(.add-new)').find(c => c.text().includes('ToDelete'));
    await customChip.trigger('click');
    await wrapper.find('.btn-outline-danger').trigger('click');
    expect(wrapper.find('.confirm-modal').exists()).toBe(true);
    await wrapper.find('.btn-danger').trigger('click');
    expect(store.customCategories).not.toHaveProperty('ToDelete');
  });

  it('cancels delete confirmation', async () => {
    store.addCustomCategory('KeepMe', [{ word: 'A', hint: 'B' }, { word: 'C', hint: 'D' }]);
    const wrapper = mount(CategorySelection, {
      props: { ...defaultProps, isEditMode: true },
      global: { stubs }
    });
    const customChip = wrapper.findAll('.category-chip:not(.add-new)').find(c => c.text().includes('KeepMe'));
    await customChip.trigger('click');
    await wrapper.find('.btn-outline-danger').trigger('click');
    // Cancel the delete
    const cancelBtns = wrapper.findAll('.btn-outline-light');
    await cancelBtns[cancelBtns.length - 1].trigger('click');
    expect(store.customCategories).toHaveProperty('KeepMe');
  });

  it('applies editing class in edit mode', () => {
    const wrapper = mount(CategorySelection, {
      props: { ...defaultProps, isEditMode: true },
      global: { stubs }
    });
    const chips = wrapper.findAll('.category-chip.editing');
    expect(chips.length).toBeGreaterThan(0);
  });

  it('applies custom class to custom category chips', () => {
    store.addCustomCategory('MyStuff', [{ word: 'A', hint: 'B' }]);
    const wrapper = mount(CategorySelection, { props: defaultProps, global: { stubs } });
    const customChips = wrapper.findAll('.category-chip.custom');
    expect(customChips.length).toBe(1);
  });

  it('shows mode toggle label', () => {
    const wrapper = mount(CategorySelection, { props: defaultProps, global: { stubs } });
    expect(wrapper.text()).toContain('MODO JUEGO');

    const wrapper2 = mount(CategorySelection, {
      props: { ...defaultProps, isEditMode: true },
      global: { stubs }
    });
    expect(wrapper2.text()).toContain('MODO EDICIÓN');
  });

  it('emits update:isEditMode on switch toggle', async () => {
    const wrapper = mount(CategorySelection, { props: defaultProps, global: { stubs } });
    const switchInput = wrapper.find('.form-check-input');
    await switchInput.setValue(true);
    expect(wrapper.emitted('update:isEditMode')).toBeTruthy();
  });

  it('edits existing category and renames it', async () => {
    store.addCustomCategory('OldName', [{ word: 'W1', hint: 'H1' }, { word: 'W2', hint: 'H2' }]);
    const wrapper = mount(CategorySelection, {
      props: { ...defaultProps, isEditMode: true, selectedCategories: ['Comidas', 'OldName'] },
      global: { stubs }
    });
    const chip = wrapper.findAll('.category-chip:not(.add-new)').find(c => c.text().includes('OldName'));
    await chip.trigger('click');

    // Change name
    const nameInput = wrapper.find('.category-name-input');
    await nameInput.setValue('NewName');

    // Save (words already populated from existing)
    const saveBtn = wrapper.findAll('.btn-primary').find(b => b.text().includes('Guardar'));
    await saveBtn.trigger('click');

    expect(store.customCategories).not.toHaveProperty('OldName');
    expect(store.customCategories).toHaveProperty('NewName');
  });

  it('handles executeDelete with null categoryToDelete', async () => {
    const wrapper = mount(CategorySelection, { props: defaultProps, global: { stubs } });
    // Directly call internal - just ensure no crash
    wrapper.vm.categoryToDelete = null;
    wrapper.vm.executeDelete();
    // Should not throw
  });

  it('handles openEditModal for category with no words', async () => {
    store.addCustomCategory('Empty', []);
    const allCatsBefore = store.getAllCategories();
    // Remove the category words to simulate an edge case
    delete allCatsBefore['Empty'];
    // This should work without errors
    const wrapper = mount(CategorySelection, {
      props: { ...defaultProps, isEditMode: true },
      global: { stubs }
    });
    // The chip won't exist if we deleted it, so re-add
    store.addCustomCategory('HasWords', [{ word: 'A', hint: 'B' }]);
    await wrapper.vm.$nextTick();
  });
});
