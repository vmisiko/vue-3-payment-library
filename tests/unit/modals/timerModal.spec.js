import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils'
import timerModal from '@/components/modals/timerModal'
import iconView from '@/components/iconView';
import notification from '@/components/notificationComponent';
import sendyBtn from '@/components/sendyBtn';

Vue.use(VueI18n);
const i18n = new VueI18n({});


describe('timerModal', () => {
  const wrapper = shallowMount(timerModal, {
    propsData: {
      show: true,
    },
    i18n,
    stubs: {
      'IconView': iconView,
      'Snackbar': notification,
      'sendy-btn': sendyBtn,
    }
  });
  it('renders props when passed', () => {
    expect(wrapper.props('show')).to.be.true
  });

  it('Tests handleOpen() function', () => {
    wrapper.vm.handleOpen();
    expect(wrapper.find('.modal').isVisible()).to.be.true
  });

  it('Tests handleClose() function', () => {
    wrapper.vm.handleClose();
    expect(wrapper.find('.modal').isVisible()).to.be.false
  });

})