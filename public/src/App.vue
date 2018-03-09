<template>
  <div id="app">
    <div class="toolbar">
      <!-- <span style="font-size: 13px;">რეგულირების მოდული</span><br />
      <span style="font-size: 13px;">ლიცენზირება/ნებართვები</span><br />
      <span style="font-size: 15px;">ელექტრონული ჯანდაცვა</span> -->
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
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
  background-color: rgb(3, 96, 206);
  height: 70px;
  /* height: 83px; */
  margin-bottom: 5px;
  color: white;
}

.actions {
  white-space: nowrap;
}
</style>
