const execa = require('execa');
const fs = require('fs');

(async () => {
    try {
        await execa('git', ['checkout', '--orphan', 'gh-pages']);
        console.log('building...');
        await execa('npm', ['run', 'build']);
        await execa('git', ['--work-tree', 'dist', 'add', '--all']);
        await execa('git', ['--work-tree', 'dist', 'commit', '-m', 'gh-pages']);
        console.log('pushing to GitHub Pages...');
        await execa('git', ['push', 'origin', 'HEAD:gh-pages', '--force']);
        await execa('rm', ['-r', 'dist']);
        await execa('git', ['checkout', '-f', 'master']);
        await execa('git', ['branch', '-D', 'gh-pages']);
        console.log('successfully deployed!');
    } catch (e) {
        console.log(e.message);
        process.exit(1);
    }
})();