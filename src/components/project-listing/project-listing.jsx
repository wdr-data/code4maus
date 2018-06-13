import React from 'react';
import styles from './project-listing.css';
import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import classNames from 'classnames';

export const ProjectListingComponent = props => (
    <Box className={styles.listingWrapper}>
        <Box className={styles.section}>
            <span className={styles.sectionTitle}>Lernen</span>
        </Box>
        <Box className={classNames(styles.section, styles.sectionProject)}>
            <span className={styles.sectionTitle}><strong>Selber machen</strong></span>
            <Box className={styles.sectionBody}>
                <Button>+ Neu</Button>
                {Object.keys(props.projects).map(key => (
                    <Box key={key} className={styles.projectWrapper}>
                        <a href={`/projekt/${key}`} className={styles.projectName}>{props.projects[key].name}</a>
                        <span className={styles.projectChanged}>{new Date(props.projects[key].updated_at).toLocaleDateString()}</span>
                    </Box>
                ))}
            </Box>
        </Box>
    </Box>
);

export default ProjectListingComponent;
