import { check_authenticated, load_user, refresh } from '../redux/actions/auth';
import {
    get_items,
    get_total,
    get_item_total
} from "../redux/actions/cart";

import {
    get_user_profile
} from "../redux/actions/profile";

import { useEffect } from 'react';
import { connect } from 'react-redux';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';

const Layout = (props) => {

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async() => {
        await props.refresh()
        await props.check_authenticated()
        await props.load_user()
        await props.get_items()
        await props.get_total()
        await props.get_item_total()
        await props.get_user_profile()
    }, []);

    return(
        <div>
            <Navbar/>
            {props.children}
            <Footer/>
        </div>
    )
}


export default connect(null, {
    check_authenticated,
    load_user,
    refresh,
    get_items,
    get_total,
    get_item_total,
    get_user_profile
}) (Layout)