import React, { useEffect, useMemo, useRef } from 'react';
import { Field, TextInput, ToggleSwitch, MultiSelectFiltered, Box, Skeleton } from '@rocket.chat/fuselage';
import { useMutableCallback } from '@rocket.chat/fuselage-hooks';

import { useTranslation } from '../../../../client/contexts/TranslationContext';
import { useEndpointDataExperimental, ENDPOINT_STATES } from '../../../../client/hooks/useEndpointDataExperimental';
import { useForm } from '../../../../client/hooks/useForm';

const getInitialData = (data = {}) => ({
	enabled: data.active ?? true,
	name: data.name ?? '',
	departments: data.departments ?? [],
});

const BusinessHoursMultipleContainer = ({ onChange, data: initialData }) => {
	const saveData = useRef({});

	const { data, state } = useEndpointDataExperimental('livechat/department');

	const onChangeValue = useMutableCallback(({ initialValue, value, key }) => {
		const { current } = saveData;
		if (JSON.stringify(initialValue) !== JSON.stringify(value)) {
			current[key] = value;
		} else {
			delete current[key];
		}
	}, []);

	const { values, handlers, hasUnsavedChanges } = useForm(getInitialData(initialData), onChangeValue);

	useEffect(() => {
		onChange({
			data: saveData.current,
			hasUnsavedChanges,
		});
	}, [hasUnsavedChanges, onChange]);

	const departmentList = useMemo(() => data && data.departments?.map(({ _id, name }) => [_id, name]), [data]);

	if (state === ENDPOINT_STATES.LOADING) {
		return <>
			<Skeleton />
			<Skeleton />
			<Skeleton />
		</>;
	}

	return <BusinessHoursMultiple values={values} handlers={handlers} departmentList={departmentList}/>;
};

export const BusinessHoursMultiple = ({ values = {}, handlers = {}, className, departmentList = [] }) => {
	const t = useTranslation();

	const {
		enabled,
		name,
		departments,
	} = values;

	const {
		handleEnabled,
		handleName,
		handleDepartments,
	} = handlers;

	return <>
		<Field className={className}>
			<Box display='flex' flexDirection='row'>
				<Field.Label>{t('Enabled')}</Field.Label>
				<Field.Row>
					<ToggleSwitch checked={enabled} onChange={handleEnabled}/>
				</Field.Row>
			</Box>
		</Field>
		<Field className={className}>
			<Field.Label>{t('Name')}</Field.Label>
			<Field.Row>
				<TextInput value={name} onChange={handleName} placeholder={t('Name')}/>
			</Field.Row>
		</Field>
		<Field className={className}>
			<Field.Label>{t('Departments')}</Field.Label>
			<Field.Row>
				<MultiSelectFiltered options={departmentList} value={departments} onChange={handleDepartments} placeholder={t('Departments')}/>
			</Field.Row>
		</Field>
	</>;
};

export default BusinessHoursMultipleContainer;
