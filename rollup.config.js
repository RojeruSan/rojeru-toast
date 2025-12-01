import terser from '@rollup/plugin-terser';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/rojeru-toast.js',
            format: 'umd',
            name: 'RojeruToast',
            exports: 'default'
        },
        {
            file: 'dist/rojeru-toast.esm.js',
            format: 'es',
            exports: 'default'
        }
    ],
    plugins: [
        terser({
            format: {
                comments: false
            }
        })
    ]
};