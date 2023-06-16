import type { Meta, StoryObj } from '@storybook/react';

import Address from './address';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Address> = {
    title: 'Address',
    component: Address,
    tags: ['autodocs'],
    argTypes: {

    },
};

export default meta;
type Story = StoryObj<typeof Address>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
    args: {
        address: "0x1234...5678",
        iconColor: "green"
    },
};


export const Secondary: Story = {
    args: {
        address: "0x1234...5678",
        //   iconColor: "green"
    },
};


