import { ClipLoader } from 'react-spinners';

const override = {
    display: 'block',
    margin: '100px auto',
};

const Spinner = ({ loading = true }) => {
    return (
        <ClipLoader
            color='#378ADD'
            loading={loading}
            cssOverride={override}
            size={150}
        />
    );
};
export default Spinner;
