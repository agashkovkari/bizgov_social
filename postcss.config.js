module.exports = (options) => {

  const devMode = (options.env === 'development')

  return {
    plugins: [
      require('postcss-import'),
      require('tailwindcss/nesting'),
      require('tailwindcss'),
      require('autoprefixer'),
      devMode ? null : require('cssnano'),
    ],
  }
}