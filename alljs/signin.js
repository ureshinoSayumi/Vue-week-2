const app = Vue.createApp({
	data() {
		return {
			user: {
				username: '',
				password: '',
			},
			loading: false,
			baseUrl: 'https://vue3-course-api.hexschool.io',
		}
	},
	methods: {
		
    signin() {
			if (!this.user.username && !this.user.password) return 
			this.loading = true
      const url = 'https://vue3-course-api.hexschool.io/v2'
			axios.post(`${url}/admin/signin`, this.user)
				.then((response) => {
					const { token, expired } = response.data
					document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
					window.location = 'products.html'
					this.loading = false
				})
				.catch(() => {
					alert('登入失敗')
					this.user = {
						username: '',
						password: '',
					}
					this.loading = false
				})
    }
  },
	mounted() {
	}
}).mount('#app')
