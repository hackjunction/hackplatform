import React, { useState, useEffect } from 'react';
import RecruitmentUserModal from 'components/modals/RecruitmentUserModal';

import { connect } from 'react-redux';

import { Paper, Box, List, ListItem, ListItemText } from '@material-ui/core';

import * as RecruitmentSelectors from 'redux/recruitment/selectors';

const SearchResults = ({ searchResults }) => {
    const [selected, setSelected] = useState();

    console.log('SEARCH RESULTS', searchResults);

    return (
        <React.Fragment>
            <List>
                {searchResults.map(item => (
                    <Box mb={1} key={item._id}>
                        <Paper>
                            <ListItem onClick={e => setSelected(item.userId)}>
                                <ListItemText primary={item.firstName} secondary={item.lastName} />
                            </ListItem>
                        </Paper>
                    </Box>
                ))}
            </List>
            <RecruitmentUserModal profileId={selected} onClose={setSelected} />
        </React.Fragment>
    );
};

const mapState = state => ({
    searchResults: RecruitmentSelectors.searchResultsMapped(state)
});

export default connect(mapState)(SearchResults);