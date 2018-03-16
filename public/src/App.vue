<template>
  <div id="app">
    <div class="toolbar">
      <div class="rowDirection">
        <img src="/static/defaultlogo.png" float="left">
        <div class="toolbar-text">
          <span style="font-size: 13px;">რეგულირების მოდული</span><br />
          <span style="font-size: 13px;">ლიცენზირება/ნებართვები</span><br />
          <span style="font-size: 15px;">ელექტრონული ჯანდაცვა</span>
        </div>
      </div>
    </div>
    <router-view/>
    <notify></notify>
  </div>
</template>

<script>
import notify from './components/common/notify'

export default {
  name: 'App',
  components: {
    notify
  }
}
</script>

<style>
body {
  /* background-color: #f5f5f5; */
  /* background-color: #fafafa; */
  /* background-color: #f4f5f6; */
  /* background-color: #f1f2f4; */
  background-color: #f9fbfe;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.round-button {
  border-radius: 50% !important;
  width: 2.4rem;
  height: 2.4rem;
}

/* copied properties from bootstrap's form-control */
.picker-input:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.picker-input:disabled {
  background-color: #e9ecef;
  opacity: 1;
}

/* copied properties from bootstrap's form-control */
.picker-input {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.toolbar {
  background-color: #196AB0;
  height: 75px;
  /* height: 83px; */
  margin-bottom: 5px;
  color: white;
}

.toolbar img {
  margin-top: 3px;
  margin-left: 5px;
}

.toolbar-text {
  margin-left: 5px;
}

.bg-stone {
  background-color: #336B87 !important;
  border-color: #336B87 !important;
}

.btn-bl {
  background-color: #0F76DB;
  border-color: #0F76DB;
  color: white;
}

.btn-bl:hover {
  background-color: #1363B9;
  border-color: #1363B9;
}

.actions {
  white-space: nowrap;
}

.sync-button {
  margin-top: calc(1.875rem + 1px);
}

.rowDirection {
  display: flex;
  flex-direction: row;
}

.page-footer {
  margin-bottom: 1rem;
  padding-right: 5%;
  text-align: right;
}

.nav-tabs .nav-link {
  border-top-left-radius: 1rem !important;
  border-top-right-radius: 1rem !important;
  margin-left: 1px;
  background-color: #E0E2E6;
}

.nav-tabs .nav-link:hover {
  border-color: #D0D2D5;
}

.tableHeader {
  /* background-color: #adb4b8; */
  /* background-color: #b8bdc1; */
  background-color: #d0d4d6;
  /* background-color: #d5d7e0; */
}
</style>
