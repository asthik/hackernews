import App from './components/App';
import Storypage from './components/Storypage';
import Pagenotfound from './components/Pagenotfound';
import loadData from './helpers/loadData';

const Routes = [
    {
        component: App,
        routes: [
            {
                path: '/',
                component: Storypage,
                exact: true,
                loadData: () => loadData('story')
            },
            {
                component: Pagenotfound
            }
        ]
    }
]

export default Routes;