import React, { useRef } from 'react';
import { Button, ButtonGroup } from '@rocket.chat/fuselage';
import { useMutableCallback } from '@rocket.chat/fuselage-hooks';

import BusinessHoursFormContainer from './BusinessHoursFormContainer';
import Page from '../../components/basic/Page';
import PageSkeleton from '../../components/PageSkeleton';
import { useTranslation } from '../../contexts/TranslationContext';
import { useMethod } from '../../contexts/ServerContext';
import { useEndpointDataExperimental, ENDPOINT_STATES } from '../../hooks/useEndpointDataExperimental';

const mapForm = (formData, data) => {
	const { daysOpen, daysTime } = formData;

	return [];

	// return data.workHours?.map((day) => {
	// 	const { day: currentDay, start: { time: start }, finish: { time: finish } } = day;
	// 	const open = daysOpen.includes(currentDay);
	// 	if (daysTime[currentDay]) {
	// 		const { start, finish } = daysTime[currentDay];
	// 		return { day: currentDay, start, finish, open };
	// 	}
	// 	return { day: currentDay, start, finish, open };
	// }) || [];
};

const EditBusinessHoursPage = (id) => {
	const t = useTranslation();

	const { data, state } = useEndpointDataExperimental(`livechat/business-hour?_id=${ id }`);

	const saveData = useRef({ form: {} });

	const save = useMethod('livechat:saveBusinessHour');

	const handleSave = useMutableCallback(async () => {
		const { current: { form, multiple = {}, timezone } } = saveData;
		const mappedForm = mapForm(form, data.businessHour);
		console.log(mappedForm);
		try {
			const result = await save({
				_id: id,
				...multiple,
				...timezone && { timezoneName: timezone },
				workHours: mappedForm,
			});

			console.log(result);
		} catch (error) {
			console.log(error);
		}
	});

	if (state === ENDPOINT_STATES.LOADING) {
		return <PageSkeleton />;
	}

	return <Page>
		<Page.Header title={t('Business_Hours')}>
			<ButtonGroup>
				<Button primary onClick={handleSave}>
					{t('Save')}
				</Button>
			</ButtonGroup>
		</Page.Header>
		<Page.ScrollableContentWithShadow>
			<BusinessHoursFormContainer data={data.businessHour} saveRef={saveData}/>
		</Page.ScrollableContentWithShadow>
	</Page>;
};

export default EditBusinessHoursPage;
