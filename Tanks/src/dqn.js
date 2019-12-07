export default class DQN    {
    constructor(game)   {
        this.game = game;
        this.model = this.createModel();
        this.target = this.createModel();
        this.actions = ["U", "D", "L", "R", "-", "^", ">", "v", "<"];
    }

    createModel()   {
        const model = tf.sequential();
        model.add(tf.layers.conv2d({
            filters: 128,
            kernelSize: 3,
            strides: 1,
            activation: 'relu',
            inputShape: [this.game.gameHeight, this.game.gameWidth, 2]
        }));
        model.add(tf.layers.batchNormalization());
        model.add(tf.layers.conv2d({
            filters: 256,
            kernelSize: 3,
            strides: 1,
            activation: 'relu'
        }));
        model.add(tf.layers.batchNormalization());
        model.add(tf.layers.conv2d({
            filters: 256,
            kernelSize: 3,
            strides: 1,
            activation: 'relu'
        }));
        model.add(tf.layers.flatten());
        model.add(tf.layers.dense({
            units: 100,
            activation:'relu'
        }));
        //model.add(tf.layers.dropout({rate: 0.25}));
        //model.add(tf.layers.dense({units: numActions}));

        return model;
    }
}