VeeValidate.defineRule('required', VeeValidateRules.required);
VeeValidate.defineRule('email', VeeValidateRules.email);
VeeValidate.defineRule('min', VeeValidateRules.min);
VeeValidate.defineRule('max', VeeValidateRules.max);
// 自定義測試
VeeValidate.defineRule('email2', value => {
  if (!value || !value.length) {
    return 'This field is required';
  }
  return true;
});
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const app = Vue.createApp({
	data() {
		return {
			url: 'https://vue3-course-api.hexschool.io/v2',
			allProducts: [],
			loading: false,
			loadInput: null,
			user: {
				'email': null,
				'name': null,
				'telephone': null,
				'address': null,
				'message': null,
			},
			productModal: null,
			// modal
			product: {'title': 'ss'},
			// cart
			productCarts: {},
		}
	},
	components: {
    VForm: VeeValidate.Form,
    VField: VeeValidate.Field,
    ErrorMessage: VeeValidate.ErrorMessage,
  },
	methods: {
    getAllProducts() {
			this.loading = true
			axios.get(`${this.url}/api/ciye-project/products/all`)
				.then((response) => {
					this.allProducts = response.data.products
					this.loading = false
				})
				.catch(() => {
					this.loading = false
				})
    },
		getCart() {
			axios.get(`${this.url}/api/ciye-project/cart`)
				.then((response) => {
					
					this.productCarts = response.data.data
					this.loading = false
				})
				.catch(() => {
					this.loading = false
				})
		},
		editCart(product) {
			this.loading = true
			this.loadInput = product.id
			const data = {
				"data": {
					"product_id": product.id,
					"qty": product.qty
				}
			}
			axios.put(`${this.url}/api/ciye-project/cart/${product.id}`, data)
				.then((response) => {
					this.loading = false
					this.loadInput = null
					alert('更新完成')
					this.getCart()
				})
				.catch(() => {
					this.loading = false
				})
		},
		deleteCart(productId) {
			this.loading = true
			axios.delete(`${this.url}/api/ciye-project/cart/${productId}`)
			.then((response) => {
				this.loading = false
				this.getCart()
			})
			.catch(() => {
				this.loading = false
			})
		},
		deleteAllCart() {
			axios.delete(`${this.url}/api/ciye-project/carts`)
			.then((response) => {
				alert('刪除完成')
				this.getCart()
			})
			.catch((error) => {
			})
		},
		inputCart(productId, qty=1) {
			this.loading = true
			const data = {
				"data": {
					"product_id": productId,
					"qty": qty
				}
			}
			axios.post(`${this.url}/api/ciye-project/cart`, data)
				.then((response) => {
					this.loading = false
					this.productModal.hide()
					this.getCart()
					alert('新增成功')

				})
				.catch(() => {
					this.loading = false
				})
		},
		orderPost() {
			if (this.productCarts.carts.length === 0) {
				alert('購物車無商品')
				return
			}
			const data = {
				"data": {
					"user": {
						"name": this.user.name,
						"email": this.user.email,
						"tel": this.user.telephone,
						"address": this.user.address
					},
					"message": this.user.message
				}
			}
			this.loading = true
			axios.post(`${this.url}/api/ciye-project/order`, data)
				.then((response) => {
					this.productCarts = {}
					this.loading = false
					this.user = {
						'email': null,
						'name': null,
						'telephone': null,
						'address': null,
						'message': null,
					}
					alert("成功建立訂單")
					this.getCart()
					this.getOrderData()
				})
				.catch(() => {
					this.loading = false
				})
		},
		getOrderData() {
			axios.get(`${this.url}/api/ciye-project/orders`)
				.then((response) => {
					this.loading = false
				})
				.catch(() => {
					this.loading = false
				})
		},
		showProductModel(product) {
			this.product = product
			this.productModal.show()
    },
  },
	mounted() {
		this.productModal = new bootstrap.Modal(this.$refs.myModal)
		this.getAllProducts()
		this.getCart()
		this.getOrderData()
	}
})

app.component('product-modal', {
	props: ['product'],
	emits: ['input-cart'],

	template: '#userProductModal',
	data() {
		return {
			qty: 1
		}
	},
	methods: {	
	},
	mounted() {
	}
})
app.mount('#app')
