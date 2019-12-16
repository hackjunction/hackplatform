import React, { useMemo, useState, useCallback } from 'react';

import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import TuneIcon from '@material-ui/icons/Tune';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import { connect } from 'react-redux';
import {
    Paper,
    Box,
    List,
    ListSubheader,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemAvatar,
    Avatar
} from '@material-ui/core';

import * as OrganiserSelectors from 'redux/organiser/selectors';

import DragDropList from 'components/generic/DragDropList';

const getAvatarStyle = index => {
    switch (index) {
        case 0:
            return {
                backgroundColor: '#ffd700'
            };
        case 1:
            return {
                backgroundColor: '#aaa9ad'
            };
        case 2:
            return {
                backgroundColor: '#cd7f32'
            };
        default:
            return {
                backgroundColor: 'rgba(0,0,0,0.5)'
            };
    }
};

const ChallengeResults = ({ event, challenge, rankingsByChallenge, allProjects, allProjectsMap }) => {
    const rankings = rankingsByChallenge?.[challenge?.slug];
    const [dragDropState, setDragDropState] = useState({
        top: [],
        bottom: Object.keys(allProjectsMap).slice(0, 10)
    });

    const renderRankedItem = useCallback(
        (id, index) => {
            const project = allProjectsMap[id];

            return (
                <ListItem>
                    <ListItemAvatar>
                        <Avatar style={getAvatarStyle(index)}>{index + 1}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={project?.name} secondary={project?.punchline} />
                </ListItem>
            );
        },
        [allProjectsMap]
    );

    const renderUnrankedItem = useCallback(
        (id, index) => {
            const project = allProjectsMap[id];

            return (
                <ListItem key={id}>
                    <ListItemAvatar>
                        <Avatar style={{ background: 'rgba(0,0,0,0.5)' }}>?</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={project?.name} secondary={project?.punchline} />
                </ListItem>
            );
        },
        [allProjectsMap]
    );

    return (
        <Paper elevation={0}>
            <DragDropList
                value={dragDropState}
                onChange={setDragDropState}
                topTitle="Ranked projects"
                renderTopItem={renderRankedItem}
                bottomTitle="Unranked projects"
                renderBottomItem={renderUnrankedItem}
            />
        </Paper>
    );
};

const mapState = state => ({
    rankingsByChallenge: OrganiserSelectors.rankingsByChallenge(state),
    allProjects: OrganiserSelectors.projects(state),
    allProjectsMap: OrganiserSelectors.projectsMap(state)
});
export default connect(mapState)(ChallengeResults);
