<template>
  <div class="flex-center">
    <div class="card">
      <div class="direction-flex">
        <svg
          width="75"
          height="75"
          viewBox="0 0 75 75"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M37.5 75C58.2107 75 75 58.2107 75 37.5C75 16.7893 58.2107 0 37.5 0C16.7893 0 0 16.7893 0 37.5C0 58.2107 16.7893 75 37.5 75Z"
            fill="#F2F5F9"
          />
          <path
            d="M21.875 36.5237V44.3362C21.875 45.9573 23.1836 47.2659 24.8047 47.2659C26.4258 47.2659 27.7344 45.9573 27.7344 44.3362V36.5237C27.7344 34.9026 26.4258 33.594 24.8047 33.594C23.1836 33.594 21.875 34.9026 21.875 36.5237ZM33.5938 36.5237V44.3362C33.5938 45.9573 34.9023 47.2659 36.5234 47.2659C38.1445 47.2659 39.4531 45.9573 39.4531 44.3362V36.5237C39.4531 34.9026 38.1445 33.594 36.5234 33.594C34.9023 33.594 33.5938 34.9026 33.5938 36.5237ZM20.8984 57.0315H52.1484C53.7695 57.0315 55.0781 55.7229 55.0781 54.1018C55.0781 52.4807 53.7695 51.1721 52.1484 51.1721H20.8984C19.2773 51.1721 17.9688 52.4807 17.9688 54.1018C17.9688 55.7229 19.2773 57.0315 20.8984 57.0315ZM45.3125 36.5237V44.3362C45.3125 45.9573 46.6211 47.2659 48.2422 47.2659C49.8633 47.2659 51.1719 45.9573 51.1719 44.3362V36.5237C51.1719 34.9026 49.8633 33.594 48.2422 33.594C46.6211 33.594 45.3125 34.9026 45.3125 36.5237ZM34.707 16.9729L19.2773 25.0979C18.4766 25.5081 17.9688 26.3479 17.9688 27.2463C17.9688 28.594 19.0625 29.6877 20.4102 29.6877H52.6562C53.9844 29.6877 55.0781 28.594 55.0781 27.2463C55.0781 26.3479 54.5703 25.5081 53.7695 25.0979L38.3398 16.9729C37.207 16.3674 35.8398 16.3674 34.707 16.9729Z"
            fill="#324BA8"
          />
        </svg>

        <div class="mgx-4 mgt-2">
          <span class="title1"> {{ $t("pay_by_bank") }} </span>
          <div class="text-body-2">
            <span>
              {{ $t("transfer_funds") }}
            </span>
          </div>
        </div>
      </div>

      <div class="mgt-12">
        <span class="text-subtitle-1 text-gray90">
          {{ $t("how_it_works") }}</span
        >
      </div>

      <div>
        <ListView
          text="Click “Setup Pay by Bank” and we assign you a unique bank account number"
        />
        <ListView
          class="mgt-3"
          text="During checkout, you can transfer funds to Sendy using your unique bank details"
        />
        <ListView
          class="mgt-3"
          text="Once your funds hit the account, we confirm that you have paid within seconds. "
        />
      </div>

      <div class="direction-flex mgt-13">
        <div class="mgy-auto">
          <span @click="$router.go(-1)" class="link">
            {{ $t("maybe_later") }}</span
          >
        </div>

        <div class="spacer"></div>
        <sendy-btn
          :loading="loading"
          color="primary"
          :text="$t('setup_pay_by_bank')"
          @click="$router.push('/bank/terms-of-service')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SendyBtn from "../../components/sendyBtn.vue";
import ListView from "./components/listview.vue";

export default {
  name: "HowitWorks",
  components: {
    ListView,
    SendyBtn,
  },
  data() {
    return {
      loading: false,
    };
  },
};
</script>

<style scoped>
.title1 {
  font-family: "Nunito" "Sans";
  font-style: normal;
  font-weight: 600;
  font-size: 28px;
  line-height: 36px;
  text-align: center;
  letter-spacing: -0.01em;
  color: #303133;
}
</style>