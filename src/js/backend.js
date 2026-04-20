import * as wpElement from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	BaseControl,
	Card,
	CardBody,
	CardHeader,
	Button,
	Notice,
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const {
	models: modelsByCapability = {},
	preferences: initialPreferences = {},
	nonce,
	optionName,
} = window.acaiModelManagerSettings || {};

apiFetch.use( apiFetch.createNonceMiddleware( nonce ) );

const CAPABILITIES = {
	text_generation: __( 'Text Generation', 'acrossai-model-manager' ),
	image_generation: __( 'Image Generation', 'acrossai-model-manager' ),
	vision: __( 'Vision / Multimodal', 'acrossai-model-manager' ),
};

const DEFAULT_OPTION = {
	value: '',
	label: __( '\u2014 Use WordPress Default \u2014', 'acrossai-model-manager' ),
};

function SettingsApp() {
	const { useState } = wpElement;

	const [ preferences, setPreferences ] = useState(
		initialPreferences || {}
	);
	const [ isSaving, setIsSaving ] = useState( false );
	const [ notice, setNotice ] = useState( null );

	const handleChange = ( capKey, value ) => {
		setPreferences( ( prev ) => ( { ...prev, [ capKey ]: value } ) );
	};

	const handleSave = async () => {
		setIsSaving( true );
		setNotice( null );
		try {
			await apiFetch( {
				path: '/wp/v2/settings',
				method: 'POST',
				data: { [ optionName ]: preferences },
			} );
			setNotice( {
				type: 'success',
				message: __( 'Settings saved.', 'acrossai-model-manager' ),
			} );
		} catch ( error ) {
			setNotice( {
				type: 'error',
				message:
					error.message ||
					__( 'An error occurred while saving.', 'acrossai-model-manager' ),
			} );
		} finally {
			setIsSaving( false );
		}
	};

	return (
		<div className="acwpms-settings-app">
			{ notice && (
				<Notice
					status={ notice.type }
					isDismissible
					onRemove={ () => setNotice( null ) }
					className="acwpms-notice"
				>
					{ notice.message }
				</Notice>
			) }

			<Card className="acwpms-card">
				<CardHeader>
					<strong>
						{ __( 'Model Preferences', 'acrossai-model-manager' ) }
					</strong>
				</CardHeader>
				<CardBody>
					<VStack spacing={ 6 }>
						{ Object.entries( CAPABILITIES ).map(
							( [ capKey, capLabel ] ) => {
								const providerGroups =
									modelsByCapability[ capKey ] || {};
								const hasProviders =
									Object.keys( providerGroups ).length > 0;
								const selectId = `acwpms-${ capKey }`;

								return (
									<BaseControl
										key={ capKey }
										label={ capLabel }
										id={ selectId }
										help={
											! hasProviders
												? __(
														'No configured AI providers found for this capability.',
														'acrossai-model-manager'
												  )
												: undefined
										}
										__nextHasNoMarginBottom
									>
										<select
											id={ selectId }
											className="acwpms-provider-select"
											value={
												preferences[ capKey ] || ''
											}
											onChange={ ( e ) =>
												handleChange(
													capKey,
													e.target.value
												)
											}
										>
											<option value="">
												{ DEFAULT_OPTION.label }
											</option>
											{ Object.entries(
												providerGroups
											).map(
												( [
													providerId,
													group,
												] ) => (
													<optgroup
														key={ providerId }
														label={ group.label }
													>
														{ group.models.map(
															( model ) => (
																<option
																	key={
																		model.value
																	}
																	value={
																		model.value
																	}
																>
																	{
																		model.label
																	}
																</option>
															)
														) }
													</optgroup>
												)
											) }
										</select>
									</BaseControl>
								);
							}
						) }
					</VStack>
				</CardBody>
			</Card>

			<HStack
				justify="flex-start"
				className="acwpms-save-row"
			>
				<Button
					variant="primary"
					onClick={ handleSave }
					isBusy={ isSaving }
					disabled={ isSaving }
					size="compact"
				>
					{ isSaving
						? __( 'Saving\u2026', 'acrossai-model-manager' )
						: __( 'Save Changes', 'acrossai-model-manager' ) }
				</Button>
			</HStack>
		</div>
	);
}

function mount() {
	const rootEl = document.getElementById( 'acwpms-settings-root' );
	if ( ! rootEl ) {
		return;
	}
	const { createRoot, render } = wpElement;
	if ( typeof createRoot === 'function' ) {
		createRoot( rootEl ).render( <SettingsApp /> );
	} else if ( typeof render === 'function' ) {
		render( <SettingsApp />, rootEl );
	}
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', mount );
} else {
	mount();
}
