import React from 'react';
import { Box } from '@rocket.chat/fuselage';

import { useRouteParameter } from '../../contexts/RouterContext';
import EditBusinessHoursPage from './EditBusinessHoursPage';
import BusinessHoursPage from './BusinessHoursPage';


const BusinessHoursRouter = () => {
	const context = useRouteParameter('context');
	const id = useRouteParameter('id');

	if (context === 'edit' && id) {
		return <EditBusinessHoursPage id={id} />;
	}

	return <BusinessHoursPage />;
};

export default BusinessHoursRouter;
