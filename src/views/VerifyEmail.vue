<!-- src/views/VerifyEmail.vue -->
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-md">
      <h1 class="text-2xl font-bold text-center">Verify Your Email Address</h1>
      <p class="mb-4">A verification link has been sent to your email address.</p>
      <p class="mb-4">If you did not receive the email, you can request another.</p>
      <button @click="resendVerification" class="btn btn-primary w-full">Resend Verification Email</button>
      <p v-if="message" class="mt-4 text-green-500">{{ message }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import axios from '../axios';

const email = ref<string | null>(localStorage.getItem('email')); // Ottieni l'email dall'utente autenticato
const message = ref<string | null>(null);

const resendVerification = async () => {
  console.log(email.value)
  try {
    const response = await axios.post('/email/resend', { email: email.value});
    message.value = response.data.message;
  } catch (error) {
    console.error('Error resending verification email:', error);
  }
};
</script>

<style scoped>
</style>
