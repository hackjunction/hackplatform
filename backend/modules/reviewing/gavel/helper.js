const _ = require('lodash')
const Promise = require('bluebird')
const Achievement = require('../../achievement/model')
const GavelProject = require('./Project')

const GavelHelper = {}

/** Generate track placement achievements */
GavelHelper.generateTrackPlacementAchievements = async event => {
    await Achievement.clearTrackPlacementAchievements(event)
    if (!event.tracksEnabled || event.tracks.length === 0) {
        return
    }

    const projects = await GavelProject.find({
        event: event._id,
    })

    const byTrack = _.groupBy(projects, 'track')

    /** Generate achievements for each track */
    return Promise.map(
        Object.keys(byTrack),
        slug => {
            console.log('Generating achievements for track: ', slug)
            const trackProjects = byTrack[slug]
            const sorted = _.sortBy(trackProjects, p => {
                if (p.active) {
                    return p.mu * -1
                }
                return Infinity
            })
            console.log('-> ' + sorted.length + ' projects')
            return Promise.map(
                sorted,
                (project, index) => {
                    return Achievement.createTrackPlacementAchievements(
                        event,
                        project.project,
                        slug,
                        index + 1
                    )
                },
                {
                    concurrency: 5,
                }
            ).then(achievements => {
                const flat = achievements.reduce((a, b) => a.concat(b), [])
                console.log('ACHIEVEMENTS', flat.length)
                return flat
            })
        },
        {
            concurrency: 1,
        }
    ).then(result => {
        return result.reduce((a, b) => a.concat(b), [])
    })
}

GavelHelper.generateOverallPlacementAchievements = async event => {
    await Achievement.clearOverallPlacementAchievements(event)
    if (event.tracksEnabled) {
        return
    } else {
        const projects = await GavelProject.find({ event: event._id })
        const sorted = _.sortBy(projects, p => {
            if (p.active) {
                return p.mu * -1
            }
            return Infinity
        })

        return Promise.map(
            sorted,
            (project, index) => {
                return Achievement.createOverallPlacementAchievements(
                    event,
                    project.project,
                    index + 1
                )
            },
            {
                concurrency: 5,
            }
        )
    }
}

module.exports = GavelHelper
