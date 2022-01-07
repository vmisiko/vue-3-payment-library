import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils'
import AxiosErrorModal from '@/components/modals/AxiosErrorModal'
import iconView from '@/components/iconView';
import notification from '@/components/notificationComponent';
import sendyBtn from '@/components/sendyBtn';

Vue.use(VueI18n);
const i18n = new VueI18n({});


describe('AxiosErrorModal', () => {
  const wrapper = shallowMount(AxiosErrorModal, {
    propsData: {
      show: true,
      text: 'An error occurred',
    },
    i18n,
    stubs: {
      'IconView': iconView,
      'Snackbar': notification,
      'sendy-btn': sendyBtn,
    }
  });
  it('renders props when passed', () => {
    const msg = 'An error occurred';
    expect(wrapper.props('show')).to.be.true
    expect(wrapper.props('text')).to.include(msg)
  });

  it('Tests handleOpen() function', () => {
    wrapper.vm.handleOpen();
    expect(wrapper.find('#axios-modal').isVisible()).to.be.true
  });

  it('Tests handleClose() function', () => {
    wrapper.vm.handleClose();
    expect(wrapper.find('#axios-modal').isVisible()).to.be.false
  });

})
