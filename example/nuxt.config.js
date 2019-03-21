import pkg from './package'

export default {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  
  ** Global CSS
  */
  css: [
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '~/../src/index.js'
  ],
}
